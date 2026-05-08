import { Link } from "react-router-dom";
import { Star, ShoppingCart, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, formatUAH } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useCategoriesAsLegacy } from "@/hooks/useShopData";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const { categories } = useCategoriesAsLegacy();
  const category = categories.find(c => c.id === product.category);
  return (
    <article className="group aura-card overflow-hidden transition-smooth hover:-translate-y-1.5 hover:shadow-card">
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden rounded-b-[1.4rem] bg-white/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,hsl(var(--primary)/.18),transparent_42%)] opacity-80" />
        <div className="relative aspect-[1/1] grid place-items-center p-4">
          {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="h-full w-full object-contain drop-shadow-[0_18px_24px_rgba(40,50,45,.16)] transition-transform duration-500 group-hover:scale-105" loading="lazy" /> : <span className="text-xs text-muted-foreground">Фото товару</span>}
        </div>
        {product.badge && <span className="absolute left-3 top-3 rounded-full border border-primary/25 bg-primary/15 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-primary backdrop-blur">{product.badge === "Хіт продажів" ? "Хіт" : product.badge}</span>}
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary opacity-0 transition-smooth group-hover:opacity-100"><ArrowUpRight className="h-4 w-4" /></span>
      </Link>
      <div className="flex min-h-[190px] flex-col p-4 gap-3">
        {category && <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{category.name}</span>}
        <Link to={`/product/${product.id}`} className="line-clamp-2 text-base font-light leading-snug text-foreground transition-smooth hover:text-primary">{product.name}</Link>
        <div className="flex items-center gap-1 text-sm">
          {[1,2,3,4,5].map(i => <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(product.rating) ? "fill-primary text-primary" : "text-muted"}`} />)}
          <span className="ml-1 text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="mt-auto space-y-3 pt-2">
          <span className="block text-xl font-light text-gradient">{formatUAH(product.price)}</span>
          <Button onClick={() => addItem(product)} className="w-full rounded-full btn-aura border-0 font-light"><ShoppingCart className="mr-2 h-4 w-4" />Додати</Button>
        </div>
      </div>
    </article>
  );
};
