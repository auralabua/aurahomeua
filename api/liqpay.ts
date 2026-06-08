import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as crypto from 'crypto';

const PUBLIC_KEY  = 'i21815439512';
const PRIVATE_KEY = '5nf3hKe9HqtcoKFMY0U1ZZ2hiyyWeJ8qrT97XbyS';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { amount, order_id, description } = req.body;

  const params = {
    version: 3,
    public_key: PUBLIC_KEY,
    action: 'pay',
    amount: Number(amount),
    currency: 'UAH',
    description: String(description || `Замовлення BodyHome #${order_id}`),
    order_id: String(order_id),
    result_url: 'https://www.bodyhome.com.ua/order-success',
    server_url: 'https://www.bodyhome.com.ua/api/liqpay-callback',
    language: 'uk',
  };

  const jsonString = JSON.stringify(params);
  const data       = Buffer.from(jsonString).toString('base64');
  const signString = PRIVATE_KEY + data + PRIVATE_KEY;
  const signature  = crypto.createHash('sha1').update(signString).digest('base64');

  console.log('LiqPay params:', params);
  console.log('Data:', data);
  console.log('Signature:', signature);

  return res.status(200).json({ data, signature, public_key: PUBLIC_KEY });
}
