import { XMLParser } from "fast-xml-parser";
import { readFileSync, writeFileSync } from "fs";

const xml = readFileSync("/tmp/feed.xml", "utf-8");
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", textNodeName: "#text" });
const data = parser.parse(xml);

const shop = data.yml_catalog.shop;
const cats = shop.categories.category;
const offers = Array.isArray(shop.offers.offer) ? shop.offers.offer : [shop.offers.offer];

const catMap = new Map<string, { id: string; name: string; parent?: string }>();
for (const c of cats) {
  catMap.set(String(c["@_id"]), {
    id: String(c["@_id"]),
    name: typeof c === "object" ? (c["#text"] || "") : String(c),
    parent: c["@_parentId"] ? String(c["@_parentId"]) : undefined,
  });
}

const ROOT = "144529336";

// Map prom top-level category IDs -> our local category ids
const TOP_TO_LOCAL: Record<string, string> = {
  "144711342": "pillows",
  "144712036": "mats",
  "144712045": "braces",      // "Товари для реабілітації" → ортези/бандажі
  "144529338": "massagers",
  "144712042": "beauty",
  "144712044": "toys",
  "144529337": "insoles",
};

function topLevelOf(catId: string): string | null {
  let cur = catMap.get(catId);
  let safety = 0;
  while (cur && cur.parent && cur.parent !== ROOT && safety++ < 10) {
    cur = catMap.get(cur.parent);
  }
  return cur?.id ?? null;
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?(p|br|div|li)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

interface OutProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  badge?: "Хіт продажів" | "Новинка";
  description: string;
  images: string[];
  vendor?: string;
  vendorCode?: string;
  available: boolean;
}

const products: OutProduct[] = [];
let skipped = 0;

for (let i = 0; i < offers.length; i++) {
  const o = offers[i];
  const catId = String(o.categoryId);
  const top = topLevelOf(catId);
  const local = top ? TOP_TO_LOCAL[top] : null;
  if (!local) { skipped++; continue; }

  const name = (o.name_ua || o.name || "").toString().trim();
  if (!name) { skipped++; continue; }

  const price = Number(o.price) || 0;
  if (!price) { skipped++; continue; }

  const description = stripHtml((o.description_ua || o.description || "").toString());
  const pictures = Array.isArray(o.picture) ? o.picture : (o.picture ? [o.picture] : []);
  const images = pictures.filter(Boolean).map(String).slice(0, 6);

  // Pseudo-random but stable rating/reviews based on id
  const idNum = Number(o["@_id"]) || i;
  const seed = idNum % 1000;
  const rating = +(4.3 + (seed % 70) / 100).toFixed(1); // 4.3 - 4.99
  const reviews = 12 + (seed % 240);

  // Badges: every 7th hit, every 11th new
  let badge: OutProduct["badge"];
  if (idNum % 7 === 0) badge = "Хіт продажів";
  else if (idNum % 11 === 0) badge = "Новинка";

  products.push({
    id: `p${o["@_id"]}`,
    name,
    price,
    category: local,
    rating,
    reviews,
    badge,
    description: description.slice(0, 1200),
    images,
    vendor: o.vendor ? String(o.vendor) : undefined,
    vendorCode: o.vendorCode ? String(o.vendorCode) : undefined,
    available: String(o["@_available"]) !== "false",
  });
}

console.log(`Imported: ${products.length}, skipped: ${skipped}`);
const byCat: Record<string, number> = {};
for (const p of products) byCat[p.category] = (byCat[p.category] || 0) + 1;
console.log("By category:", byCat);

writeFileSync("/dev-server/src/data/products.generated.json", JSON.stringify(products, null, 2));
console.log("Wrote products.generated.json");
