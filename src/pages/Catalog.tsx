import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CategoryId } from "@/data/products";
import { useProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SlidersHorizontal, X, BedDouble, Hand, Shield, Zap, Sparkles, Baby, Footprints, Grip, Plug, ChevronRight, ChevronDown, ChevronLeft, type LucideIcon } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const categoryIcons: Record<string, LucideIcon> = {
  "ortopedychni-podushky": BedDouble,
  "ortopedychni-masazhni-kylymky": Grip,
  "ortezy-i-bandazhi": Shield,
  "masazhery": Zap,
  "elektrichni-masazhery": Plug,
  "ruchni-masazhery": Hand,
  "tovary-dlia-krasy": Sparkles,
  "rozvyvaiuchi-ihrashky": Baby,
  "ortopedychni-ustilky": Footprints,
};

const PAGE_SIZE = 24;

type SortOption = "default" | "price_asc" | "price_desc" | "name_asc" | "rating_desc";

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get("category") as CategoryId) || null;
  const initialQuery = searchParams.get("q") || "";

  const { products, isLoading: productsLoading, isError: productsError } = useProductsAsLegacy();
  const { categories, isLoading: catsLoading } = useCategoriesAsLegacy();
  const isLoading = productsLoading || catsLoading;
  const isError = productsError;

  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(initialCategory ? [initialCategory] : []);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);

  // Build category name lookup once
  const categoryNameById = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach(c => m.set(c.id, c.name));
    return m;
  }, [categories]);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setPage(1);
  }, [searchParams]);

  const toggleCategory = useCallback((id: CategoryId) => {
    setPage(1);
    setSelectedCategories(prev => prev.includes(id) ? [] : [id]);
  }, []);

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
    let list = products.filter(p => {
      if (selectedCategories.length) {
        const match = selectedCategories.some(sel => {
          if (sel === p.category) return true;
          const children = childrenBySlug.get(sel) ?? [];
          const anyChildSelected = children.some(ch => selectedCategories.includes(ch));
          if (!anyChildSelected && children.includes(p.category)) return true;
          return false;
        });
        if (!match) return false;
      }
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name_asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "rating_desc") list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return list;
  }, [selectedCategories, minPrice, maxPrice, query, sort, products, childrenBySlug]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() =>
    filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  const reset = useCallback(() => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSort("default");
    setQuery("");
    setPage(1);
    setSearchParams({});
  }, [setSearchParams]);

  const [openCategories, setOpenCategories] = useState<CategoryId[]>([]);
  const toggleOpen = (id: CategoryId) =>
    setOpenCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const hasFilters = selectedCategories.length > 0 || minPrice || maxPrice || query;

  // Active category label for SEO
  const activeCatName = selectedCategories.length === 1
    ? categoryNameById.get(selectedCategories[0])
    : undefined;

  useSEO({
    title: activeCatName
      ? `${activeCatName} — купити в Україні | BodyHome`
      : "Каталог товарів для здоров'я та ортопедії",
    description: activeCatName
      ? `${activeCatName} в інтернет-магазині BodyHome — ${filtered.length} товарів. Доставка Новою Поштою по Україні, оплата при отриманні.`
      : `Каталог ортопедичних товарів BodyHome: подушки, устілки, бандажі, масажери — ${filtered.length} товарів. Доставка по Україні.`,
    url: selectedCategories.length === 1 ? `/catalog?category=${selectedCategories[0]}` : "/catalog",
    breadcrumbs: [
      { name: "Каталог", url: "/catalog" },
      ...(activeCatName && selectedCategories.length === 1
        ? [{ name: activeCatName, url: `/catalog?category=${selectedCategories[0]}` }]
        : []),
    ],
  });

  const PROBLEM_FILTERS: { label: string; emoji: string; category: CategoryId }[] = [
    { label: "Шия і спина", emoji: "🦴", category: "ortopedychni-podushky" as CategoryId },
    { label: "Ноги і стопи", emoji: "👣", category: "ortopedychni-ustilky" as CategoryId },
    { label: "Суглоби", emoji: "🦵", category: "ortezy-i-bandazhi" as CategoryId },
    { label: "Масаж", emoji: "💆", category: "masazhery" as CategoryId },
    { label: "Краса", emoji: "✨", category: "tovary-dlia-krasy" as CategoryId },
    { label: "Дітям", emoji: "👶", category: "rozvyvaiuchi-ihrashky" as CategoryId },
  ];

  const Filters = () => (
    <div className="space-y-6">
      {/* За проблемою — швидкі чіпси */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground mb-3 uppercase tracking-widest">За проблемою</p>
        <div className="flex flex-wrap gap-1.5">
          {PROBLEM_FILTERS.map(pf => {
            const isActive = selectedCategories.includes(pf.category);
            return (
              <button
                key={pf.category}
                onClick={() => { toggleCategory(pf.category); }}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-light transition-all ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-border text-foreground/70 hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                }`}
              >
                <span>{pf.emoji}</span>
                {pf.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Категорії — акордеон з іконками */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground mb-3 uppercase tracking-widest">Категорії</p>
        <div className="flex flex-col gap-1">
          {topCategories.map(c => {
            const subs = categories.filter(s => s.parentId === c.id);
            const parentSelected = selectedCategories.includes(c.id);
            const isOpen = openCategories.includes(c.id) || subs.some(s => selectedCategories.includes(s.id));
            const Icon = categoryIcons[c.id] ?? categoryIcons[c.slug as string] ?? BedDouble;
            return (
              <div key={c.id}>
                <div className={`flex items-center gap-1 rounded-xl transition-all duration-200 ${
                  parentSelected ? "bg-primary text-white shadow-sm" : "hover:bg-secondary"
                }`}>
                  <button
                    onClick={() => toggleCategory(c.id)}
                    className="flex items-center gap-2.5 flex-1 px-3 py-2.5 text-sm font-light text-left"
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${parentSelected ? "text-white/90" : "text-muted-foreground"}`}
                      strokeWidth={1.5}
                    />
                    <span className={`flex-1 ${parentSelected ? "text-white" : "text-foreground"}`}>{c.name}</span>
                  </button>
                  {subs.length > 0 && (
                    <button
                      onClick={() => toggleOpen(c.id)}
                      className={`px-2 py-2.5 rounded-r-xl transition-colors ${parentSelected ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-primary"}`}
                    >
                      {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>

                {isOpen && subs.length > 0 && (
                  <div className="ml-6 mt-0.5 mb-1 border-l-2 border-primary/25 pl-3 flex flex-col gap-0.5">
                    {subs.map(s => {
                      const subSelected = selectedCategories.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          onClick={() => toggleCategory(s.id)}
                          className={`w-full flex items-center gap-2 text-left px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                            subSelected
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground/65 hover:bg-secondary hover:text-primary font-light"
                          }`}
                        >
                          <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${subSelected ? "bg-primary" : "bg-border"}`} />
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ціна */}
      <div className="border-t border-border/40 pt-5">
        <p className="text-[10px] font-semibold text-muted-foreground mb-3 uppercase tracking-widest">Ціна (₴)</p>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Від"
            value={minPrice}
            onChange={e => { setMinPrice(e.target.value); setPage(1); }}
            className="rounded-xl border-border/60 font-light text-sm"
          />
          <span className="text-muted-foreground font-light shrink-0">—</span>
          <Input
            type="number"
            placeholder="До"
            value={maxPrice}
            onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
            className="rounded-xl border-border/60 font-light text-sm"
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
    <div className="container py-6 sm:py-10">
      {/* Breadcrumb */}
      {activeCatName && (
        <Breadcrumb className="mb-4 text-xs">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Головна</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/catalog">Каталог</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{activeCatName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light">
            {activeCatName ? `${activeCatName} — купити в Україні` : "Каталог товарів"}
          </h1>
          <p className="text-muted-foreground mt-2 font-light text-sm">
            {isLoading
              ? "Завантаження товарів..."
              : `${query ? `Результати пошуку: "${query}" — ` : ""}Знайдено: ${filtered.length} товарів`}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
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
          <Select value={sort} onValueChange={v => { setSort(v as SortOption); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px] rounded-full font-light border-white/10">
              <SelectValue placeholder="Сортування" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default" className="font-light">За замовчуванням</SelectItem>
              <SelectItem value="price_asc" className="font-light">Ціна: від низької</SelectItem>
              <SelectItem value="price_desc" className="font-light">Ціна: від високої</SelectItem>
              <SelectItem value="name_asc" className="font-light">Назва А-Я</SelectItem>
              <SelectItem value="rating_desc" className="font-light">За рейтингом</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Mobile category chips — top-site style: icon square + label, horizontal scroll */}
      {(() => {
        const activeParent = topCategories.find(c =>
          selectedCategories.includes(c.id) ||
          categories.some(s => s.parentId === c.id && selectedCategories.includes(s.id))
        );
        const subs = activeParent ? categories.filter(s => s.parentId === activeParent.id) : [];

        const chipBase = "shrink-0 flex flex-col items-center gap-1.5 w-[72px] transition-all duration-200 active:scale-95 group";

        return (
          <div className="lg:hidden -mx-4 px-4 mb-6 space-y-2.5">
            {/* Icon chips row */}
            <div className="overflow-x-auto scrollbar-none">
              <div className="flex gap-3 w-max pb-1 pt-0.5 px-0.5">
                {/* Усі */}
                <button
                  onClick={() => { setSelectedCategories([]); setPage(1); }}
                  className={chipBase}
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl border transition-all duration-200 ${
                    selectedCategories.length === 0
                      ? "bg-primary border-primary shadow-md"
                      : "bg-white border-border/50 group-hover:border-primary/40 shadow-sm"
                  }`}>
                    🛍️
                  </span>
                  <span className={`text-[10px] font-semibold text-center leading-tight ${
                    selectedCategories.length === 0 ? "text-primary" : "text-foreground/65"
                  }`}>Усі</span>
                </button>

                {topCategories.map(c => {
                  const isActive = c.id === activeParent?.id;
                  const Icon = categoryIcons[c.id] ?? BedDouble;
                  return (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategories([c.id]); setPage(1); }}
                      className={chipBase}
                    >
                      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 ${
                        isActive
                          ? "bg-primary border-primary shadow-md"
                          : "bg-white border-border/50 group-hover:border-primary/40 shadow-sm"
                      }`}>
                        <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-primary"}`} strokeWidth={1.5} />
                      </span>
                      <span className={`text-[10px] font-semibold text-center leading-tight line-clamp-2 w-full ${
                        isActive ? "text-primary" : "text-foreground/65"
                      }`}>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subcategory pills */}
            {subs.length > 0 && (
              <div className="overflow-x-auto scrollbar-none animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex gap-1.5 w-max pb-1">
                  <button
                    onClick={() => { setSelectedCategories([activeParent!.id]); setPage(1); }}
                    className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 active:scale-95 ${
                      selectedCategories.includes(activeParent!.id) && !subs.some(s => selectedCategories.includes(s.id))
                        ? "bg-primary/10 text-primary border-primary/40"
                        : "bg-white text-foreground/60 border-border/60"
                    }`}
                  >
                    Усі {activeParent!.name.toLowerCase()}
                  </button>
                  {subs.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedCategories([s.id]); setPage(1); }}
                      className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 active:scale-95 ${
                        selectedCategories.includes(s.id)
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-foreground/60 border-border/60"
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
          {isLoading ? (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-secondary" />
                  <div className="p-3 space-y-2.5">
                    <div className="h-3 bg-secondary rounded-full w-4/5" />
                    <div className="h-3 bg-secondary rounded-full w-3/5" />
                    <div className="h-5 bg-secondary/70 rounded-full w-2/5 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 rounded-2xl bg-white/[0.035] border border-white/10">
              <p className="text-muted-foreground font-light mb-4">Не вдалося завантажити товари. Перевірте з'єднання.</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-primary text-white px-6 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Оновити сторінку
              </button>
            </div>
          ) : paginated.length > 0 ? (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                {paginated.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categoryName={categoryNameById.get(p.category)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    disabled={safePage === 1}
                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                    .reduce<(number | "...")[]>((acc, p, i, arr) => {
                      if (i > 0 && (arr[i - 1] as number) + 1 < p) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm">…</span>
                      ) : (
                        <Button
                          key={p}
                          variant={p === safePage ? "default" : "outline"}
                          size="sm"
                          className={`rounded-full min-w-[2.25rem] ${p === safePage ? "btn-aura border-0" : ""}`}
                          onClick={() => { setPage(p as number); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        >
                          {p}
                        </Button>
                      )
                    )
                  }

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    disabled={safePage === totalPages}
                    onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
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
