import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Truck, ShieldCheck, RotateCcw, Check, Tag } from "lucide-react";
import { formatUAH } from "@/data/products";
import { useProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { useSEO } from "@/hooks/useSEO";

const ProductPage = () => {
  const { id } = useParams();
  const { products, isLoading } = useProductsAsLegacy();
  const { categories } = useCategoriesAsLegacy();
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  if (isLoading) return (
    <div className="container py-20 text-center text-muted-foreground">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
  if (!product) return <Navigate to="/catalog" replace />;

  const category = categories.find(c => c.id === product.category);
  useSEO({
    title: product.name,
    description: product.description?.slice(0, 160) || product.name,
    image: product.images?.[0],
    url: `/product/${product.id}`,
    type: "product",
    price: product.price,
    availability: product.available,
    keywords: `${product.name}, купити, ціна, Україна, ${category?.name ?? ""}`,
  });

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const images = product.images?.length ? product.images : [];
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.originalPrice!) * 100) : 0;

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Split description into paragraphs for better readability
  const descParagraphs = product.description
    ? product.description.split(/\n|(?<=[.!?])\s{2,}/).filter(p => p.trim().length > 0)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 sm:py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Головна</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
          {category && <>
            <span>/</span>
            <Link to={`/catalog?category=${category.id}`} className="hover:text-primary transition-colors">{category.name}</Link>
          </>}
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* ── Images ── */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-3xl bg-secondary/30 overflow-hidden border border-border/40 grid place-items-center shadow-sm">
              {images[activeImg]
                ? <img src={images[activeImg]} alt={product.name} className="h-full w-full object-contain p-6 sm:p-10" />
                : <div className="text-muted-foreground text-sm">Немає фото</div>
              }
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="rounded-lg bg-primary/90 px-3 py-1 text-xs font-semibold text-white shadow">
                    {product.badge}
                  </span>
                )}
                {hasDiscount && (
                  <span className="rounded-lg bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
                    -{discountPct}%
                  </span>
                )}
              </div>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-primary shadow-sm" : "border-border/40 hover:border-primary/40"}`}>
                    <img src={img} alt="" className="h-full w-full object-contain p-1" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="space-y-5">
            {/* Category */}
            {category && (
              <Link to={`/catalog?category=${category.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 px-3 py-1.5 rounded-full hover:bg-primary/15 transition-colors">
                <Tag className="h-3 w-3" />{category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`h-5 w-5 ${i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} відгуків)</span>
            </div>

            {/* Price block */}
            <div className="rounded-2xl border border-border/50 bg-white p-4 sm:p-5 space-y-3">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">{formatUAH(product.price)}</span>
                {hasDiscount && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg text-muted-foreground line-through">{formatUAH(product.originalPrice!)}</span>
                    <span className="rounded-lg bg-red-500 px-2.5 py-0.5 text-sm font-bold text-white">-{discountPct}%</span>
                  </div>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Ви економите {formatUAH(product.originalPrice! - product.price)}
                </p>
              )}

              {/* Qty + Add to cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-border bg-background">
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={() => setQty(q => Math.max(1, q - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold text-base">{qty}</span>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={() => setQty(q => q + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="lg" onClick={handleAddToCart}
                  className={`flex-1 h-12 rounded-full border-0 font-medium text-sm transition-all duration-300 ${added ? "bg-green-600 hover:bg-green-600" : "btn-aura"}`}>
                  {added
                    ? <><Check className="h-5 w-5 mr-2" /> Додано!</>
                    : <><ShoppingCart className="h-5 w-5 mr-2" /> Додати в кошик</>
                  }
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Truck, label: "Доставка по Україні" },
                { icon: ShieldCheck, label: "Гарантія якості" },
                { icon: RotateCcw, label: "Повернення 14 днів" },
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 text-center">
                  <f.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-tight">{f.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {descParagraphs.length > 0 && (
              <div className="space-y-3 pt-2">
                <h2 className="text-base font-semibold text-foreground">Опис товару</h2>
                <div className="space-y-2.5 text-sm text-foreground/75 leading-relaxed">
                  {descParagraphs.slice(0, 3).map((para, i) => (
                    <p key={i}>{para.trim()}</p>
                  ))}
                  {descParagraphs.length > 3 && (
                    <details className="group">
                      <summary className="text-primary text-sm cursor-pointer hover:underline list-none">
                        Читати більше ↓
                      </summary>
                      <div className="space-y-2.5 mt-2.5">
                        {descParagraphs.slice(3).map((para, i) => (
                          <p key={i}>{para.trim()}</p>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="aura-kicker mb-1">каталог</p>
                <h2 className="text-2xl sm:text-3xl font-medium">Схожі товари</h2>
              </div>
              {category && (
                <Link to={`/catalog?category=${category.id}`}
                  className="hidden sm:flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all">
                  Всі в категорії →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
