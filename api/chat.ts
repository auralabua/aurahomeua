import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const BASE_SYSTEM = `Ти — Міла, AI-консультант інтернет-магазину BodyHome (bodyhome.com.ua).

Основна інформація:
• Сайт: bodyhome.com.ua
• Telegram: t.me/BodyHome1
• Графік: Пн–Нд 9:00–21:00 (Київ)
• Доставка: Нова Пошта по всій Україні, 1–3 дні. Вартість — за тарифами НП при отриманні.
• Оплата: картою онлайн (LiqPay, Visa/Mastercard/Apple Pay) або накладений платіж
• Повернення: 14 днів після отримання, якщо товар не використовувався

Правила:
• Відповідай ТІЛЬКИ українською мовою
• Будь дружнім, лаконічним і корисним — не більше 3-4 речень у відповіді
• Допомагай підбирати товари з наявного каталогу нижче
• Якщо питання поза твоїми знаннями — пропонуй t.me/BodyHome1
• Якщо товар є зі знижкою — обов'язково згадай старосту ціну`;

async function buildProductContext(): Promise<string> {
  const { data: products } = await supabase
    .from('products')
    .select('name, price, original_price, category_id')
    .eq('available', true)
    .order('position')
    .limit(150);

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name');

  if (!products?.length) return '';

  const catMap: Record<string, string> = {};
  (categories ?? []).forEach((c: any) => { catMap[c.id] = c.name; });

  const grouped: Record<string, string[]> = {};
  for (const p of products as any[]) {
    const cat = catMap[p.category_id] ?? 'Інше';
    if (!grouped[cat]) grouped[cat] = [];
    const priceStr = p.original_price
      ? `${p.price}₴ (знижка зі ${p.original_price}₴)`
      : `${p.price}₴`;
    grouped[cat].push(`${p.name} — ${priceStr}`);
  }

  const lines = ['', '=== КАТАЛОГ ТОВАРІВ (актуальні ціни) ==='];
  for (const [cat, items] of Object.entries(grouped)) {
    lines.push(`\n[${cat}]`);
    items.forEach(i => lines.push(`  • ${i}`));
  }
  lines.push('\n=== КІНЕЦЬ КАТАЛОГУ ===');
  return lines.join('\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sessionId } = req.body ?? {};
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  try {
    const [messagesResult, productContext] = await Promise.all([
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

    const msgs: Anthropic.MessageParam[] = rows.map(r => ({
      role: r.sender === 'customer' ? 'user' : 'assistant',
      content: r.text as string,
    }));

    // Merge consecutive same-role messages (Anthropic requires strict alternation)
    const merged: Anthropic.MessageParam[] = [];
    for (const m of msgs) {
      if (merged.length && merged[merged.length - 1].role === m.role) {
        const prev = merged[merged.length - 1];
        prev.content = `${prev.content}\n${m.content}`;
      } else {
        merged.push({ role: m.role, content: m.content });
      }
    }

    if (merged[0]?.role !== 'user') return res.status(200).json({ ok: true });

    const systemPrompt = BASE_SYSTEM + productContext;

    const completion = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 600,
      system: systemPrompt,
      messages: merged,
    });

    const aiText = completion.content[0]?.type === 'text' ? completion.content[0].text.trim() : '';
    if (!aiText) return res.status(200).json({ ok: true });

    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      sender: 'admin',
      text: aiText,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('AI chat error:', err);
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      sender: 'admin',
      text: 'Вибачте, зараз виникла технічна помилка. Напишіть нам у Telegram t.me/BodyHome1 — відповімо протягом кількох хвилин.',
    }).catch(() => {});
    res.status(200).json({ ok: true });
  }
}
