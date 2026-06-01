import { useEffect, useState } from "react";

const KEY = "bh_recent_v1";
const MAX  = 5;

function readIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function pushId(id: string): string[] {
  const ids  = readIds().filter(x => x !== id);
  const next = [id, ...ids].slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

/** Returns recently viewed product IDs (excluding the current one). */
export function useRecentlyViewed(currentId: string) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const next = pushId(currentId);
    // expose ids without current product
    setIds(next.filter(id => id !== currentId));
  }, [currentId]);

  return ids;
}
