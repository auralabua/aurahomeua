import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as crypto from 'crypto';

const PUBLIC_KEY  = 'i21815439512';
const PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY!;

function generateSignature(data: string): string {
  return crypto
    .createHash('sha1')
    .update(PRIVATE_KEY + data + PRIVATE_KEY)
    .digest('base64');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { amount, order_id, description } = req.body;

  const params = {
    version: 3,
    public_key: PUBLIC_KEY,
    action: 'pay',
    amount,
    currency: 'UAH',
    description: description || `Замовлення BodyHome #${order_id}`,
    order_id,
    result_url: 'https://www.bodyhome.com.ua/order-success',
    server_url: 'https://www.bodyhome.com.ua/api/liqpay-callback',
    language: 'uk',
    paytypes: 'card,privat24,liqpay,masterpass,moment_part,paypart,cash,invoice,qr',
    sandbox: process.env.NODE_ENV === 'development' ? 1 : 0,
  };

  const data      = Buffer.from(JSON.stringify(params)).toString('base64');
  const signature = generateSignature(data);

  res.status(200).json({ data, signature, public_key: PUBLIC_KEY });
}
