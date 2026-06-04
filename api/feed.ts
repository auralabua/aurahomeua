import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
);

const CAT_MAP: Record<string, string> = {
  // parent slugs
  'ortopedychni-podushky':           'Health & Beauty > Health Care > Supports & Braces',
  'masazhery':                       'Health & Beauty > Health Care > Massage & Relaxation',
  'ortopedychni-masazhni-kylymky':   'Sporting Goods > Exercise & Fitness > Yoga & Pilates',
  'ortezy-i-bandazhi':               'Health & Beauty > Health Care > Supports & Braces',
  'ortopedychni-ustilky':            'Health & Beauty > Health Care > Foot Care > Insoles & Inserts',
  'rozvyvaiuchi-ihrashky':           'Toys & Games > Developmental Toys',
  'tovary-dlia-krasy':               'Health & Beauty > Personal Care',
  // subcategory slugs
  'podushky-dlia-snu':               'Health & Beauty > Health Care > Supports & Braces',
  'podushky-dlia-sidinnia':          'Health & Beauty > Health Care > Supports & Braces',
  'podushky-dlia-vahitnykh':         'Health & Beauty > Health Care > Supports & Braces',
  'podushky-dytiachy':               'Health & Beauty > Health Care > Supports & Braces',
  'podushky-z-efektom-pamiati':      'Health & Beauty > Health Care > Supports & Braces',
  'elektrichni-masazhery':           'Health & Beauty > Health Care > Massage & Relaxation',
  'ruchni-masazhery':                'Health & Beauty > Health Care > Massage & Relaxation',
  'fitnes-ta-sport':                 'Sporting Goods > Exercise & Fitness',
  'aplikatory':                      'Sporting Goods > Exercise & Fitness > Yoga & Pilates',
  'kylymky-pazly':                   'Sporting Goods > Exercise & Fitness > Yoga & Pilates',
  'kylymky-z-halkoiu':               'Sporting Goods > Exercise & Fitness > Yoga & Pilates',
  'dytiachy-masazhni-kylymky':       'Toys & Games > Developmental Toys',
  'ortezy':                          'Health & Beauty > Health Care > Supports & Braces',
  'bandazhi':                        'Health & Beauty > Health Care > Supports & Braces',
  'ustilky-dlia-doroslykh':          'Health & Beauty > Health Care > Foot Care > Insoles & Inserts',
  'ustilky-dlia-ditei':              'Health & Beauty > Health Care > Foot Care > Insoles & Inserts',
  'pidpiatnyky':                     'Health & Beauty > Health Care > Foot Care > Insoles & Inserts',
  'napivustilky':                    'Health & Beauty > Health Care > Foot Care > Insoles & Inserts',
  'sensorno-rozvyvalni':             'Toys & Games > Developmental Toys',
};

const BAD_PATTERNS: Array<[RegExp, string]> = [
  [/після\s*операційний/gi,          'для фіксації'],
  [/грижовий/gi,                     'підтримуючий'],
  [/для\s+пахової\s+грижі/gi,        'для фіксації паху'],
  [/пахової\s+грижі/gi,              'пахової фіксації'],
  [/пупочний/gi,                     'черевний'],
  [/матки\b/gi,                      'для підтримки'],
  [/варикоз\w*/gi,                   'відновлення ніг'],
  [/плоскостопість/gi,               'підтримка стопи'],
  [/остеохондроз\w*/gi,              'підтримка хребта'],
  [/артроз\w*/gi,                    'підтримка суглобів'],
  [/артрит\w*/gi,                    'комфорт суглобів'],
  [/гриж[аиіею]\b/gi,               'фіксаці'],
  [/болю\b/gi,                       'дискомфорту'],
  [/болях\b/gi,                      'дискомфорті'],
  [/болі\b/gi,                       'дискомфорту'],
  [/лікування/gi,                    'догляд'],
  [/лікувальн(\w*)/gi,               'відновлювальн$1'],
  [/реабілітац(\w*)/gi,              'відновлен$1'],
  [/захворювань/gi,                  'особливостей'],
  [/захворювання/gi,                 'особливості'],
  [/хвороб\w*/gi,                    'стан'],
  [/симптом\w*/gi,                   'ознаки дискомфорту'],
  [/сколіоз\w*/gi,                   'порушення постави'],
  [/після\s+операції/gi,             'в період відновлення'],
];

function clean(text: string, maxLen: number): string {
  let s = text || '';
  for (const [pattern, repl] of BAD_PATTERNS) {
    s = s.replace(pattern, repl);
  }
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLen);
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function cdata(s: string): string {
  return s.replace(/]]>/g, ']]]]><![CDATA[>');
}

const SALE_RANGE = '2025-01-01T00:00:00+02:00/2030-12-31T23:59:59+02:00';
const BASE = 'https://www.bodyhome.com.ua';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const [productsRes, catsRes] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, price, original_price, images, description, vendor_code, available, category_id, slug')
        .eq('available', true)
        .gt('price', 0)
        .not('images', 'is', null)
        .or('parent_product_id.is.null,is_parent.eq.true')
        .order('position')
        .limit(500),
      supabase
        .from('categories')
        .select('id, slug, name'),
    ]);

    if (productsRes.error) throw productsRes.error;
    if (catsRes.error)    throw catsRes.error;

    const catById = new Map(
      (catsRes.data ?? []).map(c => [c.id, { slug: c.slug as string, name: c.name as string }])
    );

    const items: string[] = [];
    let skipped = 0;

    for (const p of productsRes.data ?? []) {
      const images: string[] = Array.isArray(p.images) ? p.images : [];
      const validImages = images.filter((img: string) => img?.startsWith('http'));
      if (validImages.length === 0) { skipped++; continue; }

      const cat     = catById.get(p.category_id as string);
      const catSlug = cat?.slug ?? '';
      const catName = cat?.name ?? "Товари для здоров'я";
      const googleCat = CAT_MAP[catSlug] ?? 'Health & Beauty > Health Care';

      const price    = parseFloat(p.price as string);
      const origPrice = parseFloat((p.original_price ?? '0') as string);
      const hasDiscount = origPrice > price;

      const productSlug = (p.slug as string) || (p.id as string);
      const title = clean(p.name as string, 150);
      const desc  = clean((p.description as string) || (p.name as string), 500) || title;

      const priceBlock = hasDiscount
        ? `      <g:price>${origPrice.toFixed(2)} UAH</g:price>
      <g:sale_price>${price.toFixed(2)} UAH</g:sale_price>
      <g:sale_price_effective_date>${SALE_RANGE}</g:sale_price_effective_date>`
        : `      <g:price>${price.toFixed(2)} UAH</g:price>`;

      const addlImg = validImages[1]
        ? `\n      <g:additional_image_link>${esc(validImages[1])}</g:additional_image_link>`
        : '';

      const mpn = p.vendor_code
        ? `\n      <g:mpn>${esc(String(p.vendor_code))}</g:mpn>`
        : '';

      items.push(`    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${cdata(title)}]]></g:title>
      <g:description><![CDATA[${cdata(desc)}]]></g:description>
      <g:link>${esc(`${BASE}/product/${productSlug}`)}</g:link>
      <g:image_link>${esc(validImages[0])}</g:image_link>${addlImg}
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
${priceBlock}
      <g:brand>BodyHome</g:brand>
      <g:google_product_category>${esc(googleCat)}</g:google_product_category>
      <g:product_type><![CDATA[${cdata(catName)}]]></g:product_type>
      <g:identifier_exists>FALSE</g:identifier_exists>${mpn}
      <g:shipping>
        <g:country>UA</g:country>
        <g:service>Нова Пошта</g:service>
        <g:price>0 UAH</g:price>
      </g:shipping>
      <g:shipping_weight>0.5 kg</g:shipping_weight>
    </item>`);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>BodyHome — Ортопедичні товари та масажери</title>
    <link>${BASE}</link>
    <description>BodyHome — інтернет-магазин ортопедичних товарів</description>
    <language>uk</language>
${items.join('\n')}
  </channel>
</rss>`;

    console.log(`Feed: ${items.length} items, ${skipped} skipped`);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    res.status(200).send(xml);
  } catch (err) {
    console.error('Feed error:', err);
    res.status(500).send('<?xml version="1.0"?><error>Feed generation failed</error>');
  }
}
