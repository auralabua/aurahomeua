import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";
import { formatUAH } from "@/data/products";

const POPULAR_QUERIES = [
  "ортопедична подушка",
  "масажер для спини",
  "масажний м'яч",
  "для сну",
  "для офісу",
  "для стоп",
  "подушка для шиї",
];

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary font-semibold">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
}

interface Props {
  onNavigate?: () => void;
  placeholder?: string;
  className?: string;
}

export const SearchAutocomplete = ({
  onNavigate,
  placeholder = "Пошук товарів...",
  className = "",
}: Props) => {
  const navigate = useNavigate();
  const { products } = useProductsAsLegacy();
  const { categories } = useCategoriesAsLegacy();

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const categoryNameById = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach(c => m.set(c.id, c.name));
    return m;
  }, [categories]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(p => {
        const name = p.name.toLowerCase();
        const cat = (categoryNameById.get(p.category) ?? "").toLowerCase();
        const desc = (p.description ?? "").toLowerCase();
        return name.includes(q) || cat.includes(q) || desc.includes(q);
      })
      .slice(0, 7);
  }, [query, products, categoryNameById]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset keyboard selection on query change
  useEffect(() => { setActiveIdx(-1); }, [query]);

  const doNavigate = (url: string) => {
    navigate(url);
    setFocused(false);
    setQuery("");
    onNavigate?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIdx >= 0 && results[activeIdx]) {
      const p = results[activeIdx];
      doNavigate(`/product/${p.slug ?? p.id}`);
    } else if (query.trim()) {
      doNavigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const showPopular = focused && !query.trim();
  const showResults = focused && query.trim().length > 0 && results.length > 0;
  const showNoResults = focused && query.trim().length > 0 && results.length === 0;
  const dropdownOpen = showPopular || showResults || showNoResults;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none z-10"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Пошук товарів"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
          autoComplete="off"
          className="h-11 w-full rounded-full border-border bg-white/75 pl-10 pr-9 text-sm focus:bg-white transition-colors"
        />
        {query && (
          <button
            type="button"
            onMouseDown={e => e.preventDefault()}
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-muted/80 hover:bg-muted grid place-items-center transition-colors"
            aria-label="Очистити пошук"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {dropdownOpen && (
        <div
          role="listbox"
          aria-label="Результати пошуку"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-border rounded-2xl shadow-elevated z-[60] overflow-hidden max-h-[70vh] overflow-y-auto"
        >
          {/* Popular queries */}
          {showPopular && (
            <div className="p-3 pb-3.5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium px-1 mb-2.5">
                Популярні запити
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_QUERIES.map(q => (
                  <button
                    key={q}
                    type="button"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => { setQuery(q); inputRef.current?.focus(); }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground/70 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    <Search className="h-3 w-3 shrink-0 text-muted-foreground/70" aria-hidden="true" />
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {showNoResults && (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Нічого не знайдено за запитом{" "}
                <span className="font-medium text-foreground">«{query.trim()}»</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                Спробуйте змінити запит або{" "}
                <button
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => doNavigate("/catalog")}
                  className="text-primary hover:underline"
                >
                  переглянути весь каталог
                </button>
              </p>
            </div>
          )}

          {/* Product results */}
          {showResults && (
            <>
              <ul className="py-1">
                {results.map((product, i) => {
                  const catName = categoryNameById.get(product.category);
                  const isActive = activeIdx === i;
                  return (
                    <li key={product.id} role="option" aria-selected={isActive}>
                      <button
                        type="button"
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => doNavigate(`/product/${product.slug ?? product.id}`)}
                        onMouseEnter={() => setActiveIdx(i)}
                        onMouseLeave={() => setActiveIdx(-1)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          isActive ? "bg-secondary" : "hover:bg-secondary/60"
                        }`}
                      >
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt=""
                            aria-hidden="true"
                            className="h-10 w-10 rounded-xl object-contain bg-secondary/40 shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-xl bg-secondary/60 shrink-0" aria-hidden="true" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-light text-foreground leading-snug line-clamp-1">
                            <Highlight text={product.name} query={query.trim()} />
                          </p>
                          {catName && (
                            <p className="text-[10px] text-primary/60 uppercase tracking-wider mt-0.5 font-medium">
                              {catName}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                            {formatUAH(product.price)}
                          </p>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <p className="text-[10px] text-muted-foreground line-through">
                              {formatUAH(product.originalPrice)}
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-border/40 px-2 py-1.5">
                <button
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => doNavigate(`/catalog?q=${encodeURIComponent(query.trim())}`)}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2 hover:bg-secondary/60 group transition-colors"
                >
                  <span className="text-sm text-muted-foreground">
                    Всі результати для{" "}
                    <span className="font-medium text-foreground">«{query.trim()}»</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
