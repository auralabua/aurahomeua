import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const update = req.body;
    const message = update?.message;
    if (!message?.text || !message.reply_to_message) return res.status(200).json({ ok: true });

    const replyToId: number = message.reply_to_message.message_id;
    const adminText: string = message.text.trim();

    // Find which customer message this Telegram message corresponds to
    const { data: orig } = await supabase
      .from('chat_messages')
      .select('session_id')
      .eq('tg_message_id', replyToId)
      .maybeSingle();

    if (!orig) return res.status(200).json({ ok: true });

    // Insert admin reply
    await supabase.from('chat_messages').insert({
      session_id: orig.session_id,
      sender: 'admin',
      text: adminText,
    });

    // Touch updated_at on session
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', orig.session_id);

  } catch (err) {
    console.error('Webhook error:', err);
  }

  res.status(200).json({ ok: true });
}
