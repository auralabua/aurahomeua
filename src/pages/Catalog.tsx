import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { categories, products, CategoryId } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlidersHorizontal, Star, X } from "lucide-react";

const MAX_PRICE = 1500;

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get("category") as CategoryId) || null;
  const initialQuery = searchParams.get("q") || "";

  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(initialCategory ? [initialCategory] : []);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [minRating, setMinRating] = useState(0);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => { setQuery(searchParams.get("q") || ""); }, [searchParams]);

  const toggleCategory = (id: CategoryId) =>
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

  const filtered = useMemo(() => products.filter(p => {
    if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (p.rating < minRating) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [selectedCategories, priceRange, minRating, query]);

  const reset = () => {
    setSelectedCategories([]);
    setPriceRange([0, MAX_PRICE]);
    setMinRating(0);
    setQuery("");
    setSearchParams({});
  };

  const Filters = () => (
    <div className="space-y-7">
      <div>
        <h3 className="font-semibold mb-3">Категорії</h3>
        <div className="space-y-2.5">
          {categories.map(c => (
            <div key={c.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${c.id}`}
                checked={selectedCategories.includes(c.id)}
                onCheckedChange={() => toggleCategory(c.id)}
              />
              <Label htmlFor={`cat-${c.id}`} className="text-sm font-normal cursor-pointer flex-1">
                {c.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Ціна</h3>
        <Slider
          value={priceRange}
          min={0}
          max={MAX_PRICE}
          step={50}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="my-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0]} ₴</span>
          <span>{priceRange[1]} ₴</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Рейтинг</h3>
        <div className="space-y-2">
          {[4.5, 4, 3.5, 0].map(r => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm transition-smooth ${
                minRating === r ? "bg-primary-soft text-primary font-medium" : "hover:bg-secondary"
              }`}
            >
              {r === 0 ? "Будь-який" : (
                <>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(r) ? "fill-warning text-warning" : "text-muted"}`} />
                    ))}
                  </div>
                  від {r}
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={reset} className="w-full rounded-full">
        <X className="h-4 w-4 mr-1" /> Скинути фільтри
      </Button>
    </div>
  );

  return (
    <div className="container py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl">Каталог товарів</h1>
        <p className="text-muted-foreground mt-2">
          {query ? `Результати пошуку: "${query}" — ` : ""}{filtered.length} товарів
        </p>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 p-6 rounded-2xl bg-card border border-border/60 shadow-soft">
            <Filters />
          </div>
        </aside>

        <div>
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" /> Фільтри
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] overflow-y-auto">
                <SheetHeader><SheetTitle>Фільтри</SheetTitle></SheetHeader>
                <div className="mt-6"><Filters /></div>
              </SheetContent>
            </Sheet>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl bg-secondary/40">
              <p className="text-muted-foreground">Товарів не знайдено. Спробуйте змінити фільтри.</p>
              <Button onClick={reset} className="mt-4 rounded-full">Скинути фільтри</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
