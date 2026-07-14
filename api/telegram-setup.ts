import type { VercelRequest, VercelResponse } from '@vercel/node';

// One-time endpoint to register the Telegram webhook.
// Call: GET https://www.bodyhome.com.ua/api/telegram-setup?secret=<TELEGRAM_BOT_TOKEN>
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN not set' });

  // Simple auth: pass the token as ?secret= to prevent unauthorized calls
  if (req.query.secret !== token) return res.status(403).json({ error: 'Forbidden' });

  const webhookUrl = `https://www.bodyhome.com.ua/api/telegram`;

  const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ['message'],
      drop_pending_updates: true,
    }),
  });

  const data = await response.json();
  res.status(200).json({ webhookUrl, telegram: data });
}
