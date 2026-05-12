import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CategoryId } from "@/data/products";
import { useProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";

const MAX_PRICE = 5000;

type SortOption = "default" | "price_asc" | "price_desc" | "name_asc";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get("category") as CategoryId) || null;
  const initialQuery = searchParams.get("q") || "";

  const { products } = useProductsAsLegacy();
  const { categories } = useCategoriesAsLegacy();

  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(initialCategory ? [initialCategory] : []);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => { setQuery(searchParams.get("q") || ""); }, [searchParams]);

  const toggleCategory = (id: CategoryId) =>
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const childrenBySlug = useMemo(() => {
    const m = new Map<CategoryId, CategoryId[]>();
    categories.forEach(c => {
      if (c.parentId) {
        const arr = m.get(c.parentId) ?? [];
        arr.push(c.id);
        m.set(c.parentId, arr);
      }
    });
    return m;
  }, [categories]);

  const topCategories = useMemo(() => categories.filter(c => !c.parentId), [categories]);

  const filtered = useMemo(() => {
    const expanded = new Set<CategoryId>();
    selectedCategories.forEach(id => {
      expanded.add(id);
      (childrenBySlug.get(id) ?? []).forEach(c => expanded.add(c));
    });
    let list = products.filter(p => {
      if (selectedCategories.length && !expanded.has(p.category)) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name_asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [selectedCategories, minPrice, maxPrice, query, sort, products, childrenBySlug]);

  const reset = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSort("default");
    setQuery("");
    setSearchParams({});
  };

  const hasFilters = selectedCategories.length > 0 || minPrice || maxPrice || query;

  const Filters = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-widest">Категорії</h3>
        <div className="flex flex-col gap-2">
          {topCategories.map(c => {
            const subs = categories.filter(s => s.parentId === c.id);
            const parentSelected = selectedCategories.includes(c.id);
            const anySubSelected = subs.some(s => selectedCategories.includes(s.id));
            return (
              <div key={c.id} className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleCategory(c.id)}
                  className={`px-4 py-2 rounded-full text-sm font-light transition-all duration-200 border ${
                    parentSelected
                      ? "bg-primary text-white border-primary"
                      : "bg-transparent text-foreground border-white/10 hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {c.name}
                </button>
                {(parentSelected || anySubSelected) && subs.map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleCategory(s.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-light transition-all duration-200 border ${
                      selectedCategories.includes(s.id)
                        ? "bg-primary text-white border-primary"
                        : "bg-transparent text-foreground/70 border-white/10 hover:border-primary/50 hover:text-primary"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-widest">Ціна (₴)</h3>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            placeholder="Від"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="rounded-xl border-white/10 font-light text-sm"
          />
          <span className="text-muted-foreground font-light">—</span>
          <Input
            type="number"
            placeholder="До"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="rounded-xl border-white/10 font-light text-sm"
          />
        </div>
      </div>

      {hasFilters && (
        <Button onClick={reset} className="w-full rounded-full btn-aura border-0 font-light">
          <X className="h-4 w-4 mr-2" /> Скинути фільтри
        </Button>
      )}
    </div>
  );

  return (
    <div className="container py-10">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-light">Каталог товарів</h1>
          <p className="text-muted-foreground mt-2 font-light text-sm">
            {query ? `Результати пошуку: "${query}" — ` : ""}Знайдено: {filtered.length} товарів
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full font-light">
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> Фільтри
                  {hasFilters && <span className="ml-2 h-5 w-5 rounded-full bg-primary text-white text-xs grid place-items-center">{selectedCategories.length || "!"}</span>}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] overflow-y-auto">
                <SheetHeader><SheetTitle className="font-light">Фільтри</SheetTitle></SheetHeader>
                <div className="mt-6"><Filters /></div>
              </SheetContent>
            </Sheet>
          </div>
          <Select value={sort} onValueChange={v => setSort(v as SortOption)}>
            <SelectTrigger className="w-[220px] rounded-full font-light border-white/10">
              <SelectValue placeholder="Сортування" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default" className="font-light">За замовчуванням</SelectItem>
              <SelectItem value="price_asc" className="font-light">Ціна: від низької</SelectItem>
              <SelectItem value="price_desc" className="font-light">Ціна: від високої</SelectItem>
              <SelectItem value="name_asc" className="font-light">Назва А-Я</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Mobile category quick-switch strip */}
      {(() => {
        const activeParent = topCategories.find(c =>
          selectedCategories.includes(c.id) ||
          categories.some(s => s.parentId === c.id && selectedCategories.includes(s.id))
        );
        const subs = activeParent ? categories.filter(s => s.parentId === activeParent.id) : [];
        return (
          <div className="lg:hidden -mx-4 px-4 mb-6 space-y-2">
            <div className="overflow-x-auto scrollbar-none">
              <div className="flex gap-2 w-max pb-1">
                <button
                  onClick={() => setSelectedCategories([])}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-light border transition-all ${
                    selectedCategories.length === 0
                      ? "bg-primary text-white border-primary"
                      : "bg-white/70 text-foreground/80 border-border hover:border-primary/40"
                  }`}
                >
                  Усі
                </button>
                {topCategories.map(c => {
                  const isActive = c.id === activeParent?.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategories([c.id])}
                      className={`shrink-0 px-4 py-2 rounded-full text-xs font-light border transition-all ${
                        isActive
                          ? "bg-primary text-white border-primary"
                          : "bg-white/70 text-foreground/80 border-border hover:border-primary/40"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
            {subs.length > 0 && (
              <div className="overflow-x-auto scrollbar-none">
                <div className="flex gap-2 w-max pb-1">
                  <button
                    onClick={() => setSelectedCategories([activeParent!.id])}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-light border transition-all ${
                      selectedCategories.includes(activeParent!.id) && !subs.some(s => selectedCategories.includes(s.id))
                        ? "bg-primary/15 text-primary border-primary/40"
                        : "bg-white/60 text-foreground/70 border-border hover:border-primary/40"
                    }`}
                  >
                    Усі {activeParent!.name.toLowerCase()}
                  </button>
                  {subs.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedCategories([s.id])}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-light border transition-all ${
                        selectedCategories.includes(s.id)
                          ? "bg-primary text-white border-primary"
                          : "bg-white/60 text-foreground/70 border-border hover:border-primary/40"
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 p-7 rounded-2xl aura-card">
            <Filters />
          </div>
        </aside>
        <div>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl bg-white/[0.035] border border-white/10">
              <p className="text-muted-foreground font-light">Товарів не знайдено. Спробуйте змінити фільтри.</p>
              <Button onClick={reset} className="mt-4 rounded-full btn-aura border-0 font-light">
                Скинути фільтри
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
