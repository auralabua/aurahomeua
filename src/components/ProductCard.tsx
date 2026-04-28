import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Product, formatUAH, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const category = categories.find(c => c.id === product.category);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-elevated transition-smooth border border-border/50">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden gradient-hero">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain p-4 group-hover:scale-105 transition-smooth"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">Немає фото</div>
        )}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold shadow-soft ${
            product.badge === "Хіт продажів" ? "bg-accent text-accent-foreground" : "bg-warning text-white"
          }`}>
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 gap-3">
        {category && (
          <span className="text-xs font-medium text-primary bg-primary-soft inline-block w-fit px-2 py-0.5 rounded-full">
            {category.name}
          </span>
        )}

        <Link to={`/product/${product.id}`} className="font-medium leading-snug line-clamp-2 hover:text-primary transition-smooth">
          {product.name}
        </Link>

        <div className="flex items-center gap-1 text-sm">
          {[1, 2, 3, 4, 5].map(i => (
            <Star
              key={i}
              className={`h-4 w-4 ${i <= Math.round(product.rating) ? "fill-warning text-warning" : "text-muted"}`}
            />
          ))}
          <span className="text-muted-foreground ml-1">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-xl font-bold text-foreground">{formatUAH(product.price)}</span>
          <Button
            size="sm"
            onClick={() => addItem(product)}
            className="rounded-full gradient-primary border-0 hover:opacity-90 shadow-soft"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">В кошик</span>
          </Button>
        </div>
      </div>
    </article>
  );
};
