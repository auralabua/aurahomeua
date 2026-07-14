import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TG = `https://api.telegram.org/bot${BOT_TOKEN}`;
const SITE = 'https://www.bodyhome.com.ua';

const SYSTEM = `Ти — Міла, AI-консультант інтернет-магазину BodyHome (bodyhome.com.ua).

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
• Не використовуй Markdown, зірочки чи символи форматування — тільки чистий текст
• Якщо рекомендуєш конкретні товари — додай в КІНЦІ відповіді маркер [REFS:slug1,slug2] (до 3 товарів, тільки реальні slug з каталогу)
• Якщо не рекомендуєш товар — НЕ додавай маркер [REFS:]
• Якщо питання поза твоїми знаннями — пропонуй написати менеджеру: t.me/BodyHome1`;

interface ProductInfo {
  slug: string;
  name: string;
  price: number;
  original_price: number | null;
}

async function buildProductContext(): Promise<{ text: string; productMap: Map<string, ProductInfo> }> {
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('name, price, original_price, category_id, slug').eq('available', true).order('position').limit(150),
    supabase.from('categories').select('id, name'),
  ]);

  if (!products?.length) return { text: '', productMap: new Map() };

  const catMap: Record<string, string> = {};
  (categories ?? []).forEach((c: any) => { catMap[c.id] = c.name; });

  const productMap = new Map<string, ProductInfo>();
  const grouped: Record<string, string[]> = {};

  for (const p of products as any[]) {
    const cat = catMap[p.category_id] ?? 'Інше';
    if (!grouped[cat]) grouped[cat] = [];
    const priceStr = p.original_price ? `${p.price}₴ (знижка зі ${p.original_price}₴)` : `${p.price}₴`;
    const slug = (p.slug as string) || '';
    grouped[cat].push(`${p.name} — ${priceStr}${slug ? ` | slug: ${slug}` : ''}`);
    if (slug) {
      productMap.set(slug, { slug, name: p.name, price: Number(p.price), original_price: p.original_price ? Number(p.original_price) : null });
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

async function tgSend(chatId: number, text: string, inlineKeyboard?: object[][]) {
  const body: Record<string, unknown> = { chat_id: chatId, text };
  if (inlineKeyboard?.length) {
    body.reply_markup = { inline_keyboard: inlineKeyboard };
  }
  await fetch(`${TG}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function tgAction(chatId: number) {
  await fetch(`${TG}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true });

  const update = req.body;
  const msg = update?.message;
  if (!msg?.text || !msg?.chat?.id) return res.status(200).json({ ok: true });

  const chatId: number = msg.chat.id;
  const userText: string = msg.text.trim();
  const sessionId = `tg_${chatId}`;

  // /start command
  if (userText === '/start') {
    await tgSend(chatId,
      'Привіт! Я Міла — консультант BodyHome 👋\n\nДопоможу підібрати ортопедичні подушки, масажери, устілки, бандажі та інші товари для здоров\'я і краси.\n\nЗапитуйте — відповім одразу!',
    );
    return res.status(200).json({ ok: true });
  }

  // /catalog command
  if (userText === '/catalog') {
    await tgSend(chatId, 'Перегляньте весь каталог на сайті:', [[{ text: '🛍 Відкрити каталог', url: `${SITE}/catalog` }]]);
    return res.status(200).json({ ok: true });
  }

  // /help command
  if (userText === '/help') {
    await tgSend(chatId,
      'Що я вмію:\n\n• Підібрати товар під ваш запит\n• Розповісти про ціни та наявність\n• Відповісти про доставку та оплату\n• Допомогти з поверненням\n\nПросто напишіть своє питання! 💬\n\nДля зв\'язку з менеджером: t.me/BodyHome1',
    );
    return res.status(200).json({ ok: true });
  }

  try {
    await tgAction(chatId);

    await supabase.from('chat_messages').insert({ session_id: sessionId, sender: 'customer', text: userText });

    const [{ data: rows }, { text: productContext, productMap }] = await Promise.all([
      supabase.from('chat_messages').select('sender, text').eq('session_id', sessionId).order('created_at', { ascending: true }).limit(20),
      buildProductContext(),
    ]);

    type Turn = { role: 'user' | 'model'; text: string };
    const turns: Turn[] = [];
    for (const r of (rows ?? []) as any[]) {
      const role = r.sender === 'customer' ? 'user' : 'model';
      let text = r.text as string;
      try { const p = JSON.parse(text); if (p.text) text = p.text; } catch {}
      if (turns.length && turns[turns.length - 1].role === role) {
        turns[turns.length - 1].text += '\n' + text;
      } else {
        turns.push({ role, text });
      }
    }

    if (!turns.length || turns[turns.length - 1].role !== 'user') return res.status(200).json({ ok: true });

    const history = turns.slice(0, -1).map(t => ({ role: t.role, parts: [{ text: t.text }] }));

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: SYSTEM + productContext });
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(turns[turns.length - 1].text);
    const aiRaw = result.response.text().trim();

    if (!aiRaw) return res.status(200).json({ ok: true });

    const refsMatch = aiRaw.match(/\[REFS:([^\]]+)\]/);
    const cleanText = aiRaw.replace(/\[REFS:[^\]]*\]/g, '').trim();
    const slugs = refsMatch ? refsMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];
    const refProducts = slugs.map(s => productMap.get(s)).filter(Boolean) as ProductInfo[];

    await supabase.from('chat_messages').insert({ session_id: sessionId, sender: 'admin', text: cleanText });

    const keyboard: object[][] = refProducts.map(p => {
      const priceLabel = p.original_price ? `${p.price}₴ (було ${p.original_price}₴)` : `${p.price}₴`;
      return [{ text: `🛍 ${p.name} — ${priceLabel}`, url: `${SITE}/product/${p.slug}` }];
    });

    await tgSend(chatId, cleanText, keyboard);
    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Telegram bot error:', err);
    await tgSend(chatId, 'Вибачте, виникла технічна помилка. Будь ласка, напишіть нам напряму: t.me/BodyHome1');
    return res.status(200).json({ ok: true });
  }
}
