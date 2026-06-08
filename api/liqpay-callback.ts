import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY!;
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { data, signature } = req.body;

  const expectedSig = crypto
    .createHash('sha1')
    .update(PRIVATE_KEY + data + PRIVATE_KEY)
    .digest('base64');

  if (signature !== expectedSig) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const decoded = JSON.parse(Buffer.from(data, 'base64').toString());

  if (decoded.status === 'success' || decoded.status === 'sandbox') {
    await supabase
      .from('orders')
      .update({
        admin_status: 'paid',
        payment_status: decoded.status,
        liqpay_order_id: decoded.liqpay_order_id,
      })
      .eq('order_reference', decoded.order_id);

    await fetch(`https://api.telegram.org/bot8632833094:AAF6DCv98UfUj3qu4qinE64ILwp6swJMPLo/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: '5119568271',
        text: `✅ Оплата отримана!\n\n🛍 Замовлення: ${decoded.order_id}\n💰 Сума: ${decoded.amount} грн\n💳 LiqPay`,
        parse_mode: 'HTML',
      }),
    });
  }

  res.status(200).send('OK');
}
