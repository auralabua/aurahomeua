import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createHmac } from 'node:crypto';

const MERCHANT_ACCOUNT = 'aurahomeua_com';
const MERCHANT_DOMAIN = 'aurahomeua.lovable.app';

interface Item { name: string; price: number; quantity: number }
interface Body {
  orderReference: string;
  amount: number;
  items: Item[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const secret = Deno.env.get('WAYFORPAY_MERCHANT_SECRET');
    if (!secret) throw new Error('WAYFORPAY_MERCHANT_SECRET not configured');

    const body: Body = await req.json();
    if (!body?.orderReference || !body?.amount || !Array.isArray(body.items) || body.items.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orderDate = Math.floor(Date.now() / 1000);
    const productName = body.items.map(i => i.name);
    const productCount = body.items.map(i => i.quantity);
    const productPrice = body.items.map(i => i.price);

    const signString = [
      MERCHANT_ACCOUNT,
      MERCHANT_DOMAIN,
      body.orderReference,
      orderDate,
      body.amount,
      'UAH',
      ...productName,
      ...productCount,
      ...productPrice,
    ].join(';');

    const merchantSignature = createHmac('md5', secret).update(signString).digest('hex');

    return new Response(JSON.stringify({
      merchantAccount: MERCHANT_ACCOUNT,
      merchantDomain: MERCHANT_DOMAIN,
      merchantSignature,
      orderReference: body.orderReference,
      orderDate,
      amount: body.amount,
      currency: 'UAH',
      productName,
      productCount,
      productPrice,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
