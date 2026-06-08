import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const BASE_SYSTEM = `Ти — Міла, AI-консультант інтернет-магазину BodyHome (bodyhome.com.ua).

Основна інформація:
• Сайт: bodyhome.com.ua
• Telegram: t.me/BodyHome1
• Графік: Пн–Нд 9:00–21:00 (Київ)
• Доставка: Нова Пошта по всій Україні, 1–3 дні. Вартість — за тарифами НП при отриманні.
• Оплата: карткою онлайн (LiqPay, Visa/Mastercard/Apple Pay) або накладений платіж
• Повернення: 14 днів після отримання, якщо товар не використовувався

Правила:
• Відповідай ТІЛЬКИ українською мовою
• Будь дружнім, лаконічним і корисним — не більше 3-4 речень у відповіді
• Допомагай підбирати товари з каталогу нижче
• Якщо питання поза твоїми знаннями — пропонуй t.me/BodyHome1
• Якщо товар зі знижкою — згадай стару ціну
• Якщо рекомендуєш конкретні товари з каталогу — додай в КІНЦІ відповіді маркер [REFS:slug1,slug2] (до 3 товарів, тільки реальні slug з каталогу)
• Якщо не рекомендуєш конкретний товар — НЕ додавай маркер [REFS:]`;

interface ProductInfo {
  slug: string;
  name: string;
  price: number;
  original_price: number | null;
  image: string;
}

async function buildProductContext(): Promise<{ text: string; productMap: Map<string, ProductInfo> }> {
  const { data: products } = await supabase
    .from('products')
    .select('name, price, original_price, category_id, slug, images')
    .eq('available', true)
    .order('position')
    .limit(150);

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name');

  if (!products?.length) return { text: '', productMap: new Map() };

  const catMap: Record<string, string> = {};
  (categories ?? []).forEach((c: any) => { catMap[c.id] = c.name; });

  const productMap = new Map<string, ProductInfo>();
  const grouped: Record<string, string[]> = {};

  for (const p of products as any[]) {
    const cat = catMap[p.category_id] ?? 'Інше';
    if (!grouped[cat]) grouped[cat] = [];
    const priceStr = p.original_price
      ? `${p.price}₴ (знижка зі ${p.original_price}₴)`
      : `${p.price}₴`;
    const slug = (p.slug as string) || '';
    grouped[cat].push(`${p.name} — ${priceStr}${slug ? ` | slug: ${slug}` : ''}`);

    if (slug) {
      const images = Array.isArray(p.images) ? p.images : [];
      productMap.set(slug, {
        slug,
        name: p.name as string,
        price: Number(p.price),
        original_price: p.original_price ? Number(p.original_price) : null,
        image: (images as string[]).find(img => img?.startsWith('http')) || '',
      });
    }
  }

  const lines = ['\n\n=== КАТАЛОГ ТОВАРІВ (актуальні ціни) ==='];
  for (const [cat, items] of Object.entries(grouped)) {
    lines.push(`\n[${cat}]`);
    items.forEach(i => lines.push(`  • ${i}`));
  }
  lines.push('\n=== КІНЕЦЬ КАТАЛОГУ ===');

  return { text: lines.join('\n'), productMap };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sessionId } = req.body ?? {};
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  try {
    const [messagesResult, { text: productContext, productMap }] = await Promise.all([
      supabase
        .from('chat_messages')
        .select('sender, text')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(30),
      buildProductContext(),
    ]);

    const rows = messagesResult.data;
    if (!rows?.length) return res.status(200).json({ ok: true });

    // Gemini requires alternating user/model turns
    type Turn = { role: 'user' | 'model'; text: string };
    const turns: Turn[] = [];
    for (const r of rows as any[]) {
      const role = r.sender === 'customer' ? 'user' : 'model';
      // Decode stored JSON message back to plain text for history
      let text = r.text as string;
      try {
        const parsed = JSON.parse(text);
        if (parsed.text) text = parsed.text;
      } catch {}
      if (turns.length && turns[turns.length - 1].role === role) {
        turns[turns.length - 1].text += '\n' + text;
      } else {
        turns.push({ role, text });
      }
    }

    if (turns[0]?.role !== 'user') return res.status(200).json({ ok: true });
    const lastTurn = turns[turns.length - 1];
    if (lastTurn.role !== 'user') return res.status(200).json({ ok: true });

    const history = turns.slice(0, -1).map(t => ({
      role: t.role,
      parts: [{ text: t.text }],
    }));

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: BASE_SYSTEM + productContext,
    });

    const chat   = model.startChat({ history });
    const result = await chat.sendMessage(lastTurn.text);
    const aiRaw  = result.response.text().trim();

    if (!aiRaw) return res.status(200).json({ ok: true });

    // Extract product refs marker [REFS:slug1,slug2]
    const refsMatch = aiRaw.match(/\[REFS:([^\]]+)\]/);
    const cleanText = aiRaw.replace(/\[REFS:[^\]]*\]/g, '').trim();
    const slugs = refsMatch
      ? refsMatch[1].split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const products = slugs.map(s => productMap.get(s)).filter(Boolean) as ProductInfo[];

    const messageText = products.length > 0
      ? JSON.stringify({ text: cleanText, products })
      : cleanText;

    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      sender: 'admin',
      text: messageText,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Gemini chat error:', err);
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      sender: 'admin',
      text: 'Вибачте, зараз виникла технічна помилка. Напишіть нам у Telegram t.me/BodyHome1 — відповімо протягом кількох хвилин.',
    }).catch(() => {});
    res.status(200).json({ ok: true });
  }
}
