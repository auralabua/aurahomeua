import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
);

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM = `Ти — Міла, дружній AI-асистент підтримки інтернет-магазину BodyHome (bodyhome.com.ua).

Магазин спеціалізується на товарах для здоров'я, спорту та активного відпочинку:
• Ортопедичні подушки та матраци
• Масажні килимки та аплікатори (Кузнєцова, Лянського)
• Ортези, бандажі, підтримка суглобів і спини
• Електричні та ручні масажери
• Товари для краси та догляду за тілом
• Розвиваючі іграшки для дітей
• Ортопедичні устілки

Основна інформація:
• Сайт: bodyhome.com.ua
• Telegram для зв'язку: t.me/BodyHome1
• Графік: Пн–Нд 9:00–21:00 (Київ)
• Доставка: Нова Пошта по всій Україні, 1–3 дні
• Оплата: картою онлайн, накладений платіж, Monobank, PrivatBank
• Повернення: 14 днів після отримання, якщо товар не використовувався

Правила поведінки:
• Відповідай ТІЛЬКИ українською мовою
• Будь дружнім, лаконічним і корисним
• Якщо не знаєш точної відповіді — чесно скажи та запропонуй написати в Telegram t.me/BodyHome1
• Не вигадуй ціни, наявність або характеристики конкретних товарів — направ на сайт
• Допомагай з вибором товарів, питаннями доставки/оплати/повернення`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { sessionId } = req.body ?? {};
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  try {
    const { data: rows } = await supabase
      .from('chat_messages')
      .select('sender, text')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(30);

    if (!rows?.length) return res.status(200).json({ ok: true });

    const msgs: Anthropic.MessageParam[] = rows.map(r => ({
      role: r.sender === 'customer' ? 'user' : 'assistant',
      content: r.text as string,
    }));

    // Anthropic requires alternating user/assistant roles — merge consecutive same-role messages
    const merged: Anthropic.MessageParam[] = [];
    for (const m of msgs) {
      if (merged.length && merged[merged.length - 1].role === m.role) {
        const prev = merged[merged.length - 1];
        prev.content = `${prev.content}\n${m.content}`;
      } else {
        merged.push({ role: m.role, content: m.content });
      }
    }

    // Must start with user
    if (merged[0]?.role !== 'user') return res.status(200).json({ ok: true });

    const completion = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM,
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

    // Fallback message so the user isn't left hanging
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      sender: 'admin',
      text: 'Вибачте, зараз виникла технічна помилка. Будь ласка, напишіть нам у Telegram t.me/BodyHome1 — відповімо протягом кількох хвилин.',
    }).catch(() => {});

    res.status(200).json({ ok: true });
  }
}
