import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { formatUAH } from "@/data/products";
import { useProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { ProductReviews } from "@/components/ProductReviews";

const ProductPage = () => {
  const { id } = useParams();
  const { products, isLoading } = useProductsAsLegacy();
  const { categories } = useCategoriesAsLegacy();
  const product = products.find(p => p.id === id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (isLoading) return <div className="container py-20 text-center text-muted-foreground">Завантаження…</div>;
  if (!product) return <Navigate to="/catalog" replace />;

  const category = categories.find(c => c.id === product.category);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const images = product.images?.length ? product.images : [];

  return (
    <div className="container py-10">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-smooth mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад до каталогу
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-3">
          <div className="relative aspect-square rounded-3xl gradient-hero overflow-hidden border border-white/10 grid place-items-center shadow-card">
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={product.name} className="h-full w-full object-contain p-6" />
            ) : (
              <div className="text-muted-foreground">Немає фото</div>
            )}
            {product.badge && (
              <span className={`absolute top-5 left-5 px-4 py-1.5 rounded-full text-sm font-semibold shadow-soft ${
                product.badge === "Хіт продажів" ? "bg-accent text-accent-foreground" : "bg-warning text-white"
              }`}>
                {product.badge}
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-xl overflow-hidden bg-white/[0.055] border-2 transition-smooth ${
                    activeImg === i ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain p-1" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {category && (
            <Link to={`/catalog?category=${category.id}`} className="text-xs font-medium text-primary bg-primary-soft inline-block px-3 py-1 rounded-full">
              {category.name}
            </Link>
          )}
          <h1 className="text-3xl md:text-4xl">{product.name}</h1>

          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`h-5 w-5 ${i <= Math.round(product.rating) ? "fill-warning text-warning" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} відгуків)</span>
          </div>

          <p className="text-foreground/80 leading-relaxed">{product.description}</p>

          <div className="text-4xl font-bold text-primary">{formatUAH(product.price)}</div>

          <div className="flex items-center gap-4">
            <div className="inline-flex items-center rounded-full bg-white/[0.055] p-1">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={() => setQty(q => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={() => setQty(q => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="lg"
              onClick={() => addItem(product, qty)}
              className="flex-1 rounded-full btn-aura border-0 shadow-glow hover:opacity-95"
            >
              <ShoppingCart className="h-5 w-5 mr-2" /> Додати в кошик
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            {[
              { icon: Truck, label: "Швидка доставка по Україні" },
              { icon: ShieldCheck, label: "Гарантія якості" },
              { icon: RotateCcw, label: "Повернення 14 днів" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.055]/60 text-xs">
                <f.icon className="h-4 w-4 text-primary shrink-0" />
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl mb-6">Схожі товари</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
