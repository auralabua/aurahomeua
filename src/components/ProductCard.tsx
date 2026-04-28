import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Product, formatUAH } from "@/data/products";
import { useCategoriesAsLegacy } from "@/hooks/useShopData";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const { categories } = useCategoriesAsLegacy();
  const category = categories.find(c => c.id === product.category);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-card transition-smooth">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-card">
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
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-foreground">
            {product.badge === "Хіт продажів" ? "Хіт" : product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 gap-3">
        {category && (
          <span className="text-xs font-light text-muted-foreground">
            {category.name}
          </span>
        )}

        <Link to={`/product/${product.id}`} className="font-light text-base leading-snug line-clamp-2 text-foreground hover:text-primary transition-smooth">
          {product.name}
        </Link>

        <div className="flex items-center gap-1 text-sm">
          {[1, 2, 3, 4, 5].map(i => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i <= Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"}`}
            />
          ))}
          <span className="text-muted-foreground ml-1 text-xs">({product.reviews})</span>
        </div>

        <div className="mt-auto pt-2 space-y-3">
          <span className="block text-xl font-light text-primary">{formatUAH(product.price)}</span>
          <Button
            onClick={() => addItem(product)}
            className="w-full rounded-xl btn-caramel border-0 font-light"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Додати в кошик
          </Button>
        </div>
      </div>
    </article>
  );
};
