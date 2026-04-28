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
  catMap.set(String(c["@_id"]), { id: String(c["@_id"]), name: c["#text"] || c, parent: c["@_parentId"] ? String(c["@_parentId"]) : undefined });
}

// Determine top-level categories under root 144529336
const ROOT = "144529336";
function topLevelOf(catId: string): string | null {
  let cur = catMap.get(catId);
  while (cur && cur.parent && cur.parent !== ROOT) {
    cur = catMap.get(cur.parent);
  }
  return cur?.id ?? null;
}

console.log("Top-level categories:");
for (const c of catMap.values()) {
  if (c.parent === ROOT) console.log(`  ${c.id}: ${c.name}`);
}
console.log(`\nTotal offers: ${offers.length}`);
console.log("\nSample offer keys:", Object.keys(offers[0]));
console.log("Sample offer:", JSON.stringify(offers[0], null, 2).slice(0, 1500));
