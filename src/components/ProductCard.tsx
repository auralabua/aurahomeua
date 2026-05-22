import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, formatUAH } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useCategoriesAsLegacy } from "@/hooks/useShopData";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const { addItem } = useCart();
  const { categories } = useCategoriesAsLegacy();
  const category = categories.find(c => c.id === product.category);

  if (compact) {
    return (
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card h-full">
        {/* Image — займає більше простору */}
        <Link to={`/product/${product.id}`} className="relative overflow-hidden bg-secondary/20">
          <div className="aspect-[4/3] grid place-items-center p-3">
            {product.images?.[0]
              ? <img src={product.images[0]} alt={product.name}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy" />
              : <div className="h-full w-full rounded-lg bg-secondary/60" />
            }
          </div>
          {product.badge && (
            <span className="absolute left-2 top-2 rounded-full bg-primary/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white">
              {product.badge === "Хіт продажів" ? "Хіт" : product.badge}
            </span>
          )}
        </Link>
        {/* Info — компактний без зайвих відступів */}
        <div className="flex flex-col flex-1 gap-1 p-3">
          {category && (
            <span className="text-[9px] uppercase tracking-[0.15em] text-primary/60 font-medium line-clamp-1">
              {category.name}
            </span>
          )}
          <Link to={`/product/${product.id}`}
            className="line-clamp-2 text-xs font-light leading-snug text-foreground hover:text-primary transition-colors">
            {product.name}
          </Link>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={`h-2.5 w-2.5 ${i <= Math.round(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
            ))}
          </div>
          <div className="mt-auto pt-2 flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-primary shrink-0">{formatUAH(product.price)}</p>
            <Button
              onClick={() => addItem(product)}
              size="sm"
              className="h-8 rounded-full btn-aura border-0 text-[10px] font-light gap-1 touch-manipulation px-3 shrink-0"
            >
              <ShoppingCart className="h-3 w-3 shrink-0" />
              <span className="hidden sm:inline">До кошика</span>
              <span className="sm:hidden">+</span>
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative overflow-hidden bg-secondary/30">
        <div className="aspect-square grid place-items-center p-3 sm:p-6">
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy" />
            : <div className="h-full w-full rounded-xl bg-secondary/60" />
          }
        </div>
        {product.badge && (
          <span className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full bg-primary/90 px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-white">
            {product.badge === "Хіт продажів" ? "Хіт" : product.badge}
          </span>
        )}
      </Link>
      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 sm:gap-2.5 p-3 sm:p-4">
        {category && (
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-primary/70 font-medium line-clamp-1">
            {category.name}
          </span>
        )}
        <Link to={`/product/${product.id}`}
          className="line-clamp-2 text-xs sm:text-sm font-light leading-snug text-foreground hover:text-primary transition-colors">
          {product.name}
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${i <= Math.round(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
          ))}
          {product.reviews > 0 && (
            <span className="ml-1 text-[10px] text-muted-foreground">({product.reviews})</span>
          )}
        </div>
        <div className="mt-auto pt-1.5 sm:pt-2 space-y-2 sm:space-y-3">
          <p className="text-base sm:text-xl font-light text-primary">{formatUAH(product.price)}</p>
          <Button
            onClick={() => addItem(product)}
            className="w-full h-10 rounded-full btn-aura border-0 text-[11px] sm:text-xs font-light gap-1.5 touch-manipulation"
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            До кошика
          </Button>
        </div>
      </div>
    </article>
  );
};
