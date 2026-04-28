import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const url = "https://dkzxlbggweajxdhzywmj.supabase.co";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(url, serviceKey);

const products = JSON.parse(fs.readFileSync("src/data/products.generated.json", "utf-8"));

const { data: cats, error: catErr } = await supabase.from("categories").select("id, slug");
if (catErr) throw catErr;
const catMap = Object.fromEntries((cats ?? []).map((c: any) => [c.slug, c.id]));

const rows = products.map((p: any, idx: number) => ({
  legacy_id: p.id,
  name: p.name,
  description: p.description ?? null,
  price: p.price,
  category_id: catMap[p.category] ?? null,
  images: p.images ?? [],
  available: p.available !== false,
  stock: p.available !== false ? 10 : 0,
  badge: p.badge ?? null,
  rating: p.rating ?? 5,
  reviews: p.reviews ?? 0,
  vendor: p.vendor ?? null,
  vendor_code: p.vendorCode ?? null,
  position: idx,
}));

console.log("Inserting", rows.length, "products...");
const chunkSize = 100;
for (let i = 0; i < rows.length; i += chunkSize) {
  const chunk = rows.slice(i, i + chunkSize);
  const { error } = await supabase.from("products").upsert(chunk, { onConflict: "legacy_id" });
  if (error) { console.error("chunk", i, error); throw error; }
  process.stdout.write(`${i + chunk.length}/${rows.length}\r`);
}
console.log("\nDone.");
