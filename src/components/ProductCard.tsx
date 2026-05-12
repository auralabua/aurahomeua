import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, formatUAH } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useCategoriesAsLegacy } from "@/hooks/useShopData";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const { categories } = useCategoriesAsLegacy();
  const category = categories.find(c => c.id === product.category);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative overflow-hidden bg-secondary/30">
        <div className="aspect-square grid place-items-center p-6">
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy" />
            : <div className="h-full w-full rounded-xl bg-secondary/60" />
          }
        </div>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
            {product.badge === "Хіт продажів" ? "Хіт" : product.badge}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {category && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-primary/70 font-medium">
            {category.name}
          </span>
        )}
        <Link to={`/product/${product.id}`}
          className="line-clamp-2 text-sm font-light leading-snug text-foreground hover:text-primary transition-colors">
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} className={`h-3 w-3 ${i <= Math.round(product.rating) ? "fill-primary text-primary" : "fill-muted text-muted"}`} />
          ))}
          {product.reviews > 0 && (
            <span className="ml-1 text-[11px] text-muted-foreground">({product.reviews})</span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-2 space-y-3">
          <p className="text-xl font-light text-primary">{formatUAH(product.price)}</p>
          <Button
            onClick={() => addItem(product)}
            className="w-full h-9 rounded-full btn-aura border-0 text-xs font-light gap-2"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Додати в кошик
          </Button>
        </div>
      </div>
    </article>
  );
};
