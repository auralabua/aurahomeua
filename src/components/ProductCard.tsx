import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, ProductVariant, formatUAH } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { OptimizedImage } from "@/components/OptimizedImage";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  /** Optional: resolved category name — pass from parent to avoid per-card hook calls */
  categoryName?: string;
}

const VariantChips = ({
  variants,
  selectedIdx,
  onSelect,
  max = 6,
}: {
  variants: ProductVariant[];
  selectedIdx: number;
  onSelect: (i: number) => void;
  max?: number;
}) => {
  if (!variants.length) return null;
  const visible = variants.slice(0, max);
  const extra = variants.length - max;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((v, i) => (
        <button
          key={v.label}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSelect(i); }}
          className={`text-[10px] leading-none px-1.5 py-1 rounded-md border transition-colors ${
            i === selectedIdx
              ? "border-primary bg-primary/10 text-primary font-semibold"
              : "border-border text-muted-foreground hover:border-primary/40"
          }`}
        >
          {v.label}
        </button>
      ))}
      {extra > 0 && (
        <span className="text-[10px] leading-none text-muted-foreground px-1 py-1">+{extra}</span>
      )}
    </div>
  );
};

const StarIcon = ({ fill, size }: { fill: "full" | "half" | "empty"; size: string }) => (
  <span className={`relative inline-flex ${size}`}>
    <Star className={`${size} fill-muted text-muted`} />
    {fill !== "empty" && (
      <span className="absolute inset-0 overflow-hidden" style={{ width: fill === "half" ? "50%" : "100%" }}>
        <Star className={`${size} fill-amber-400 text-amber-400`} />
      </span>
    )}
  </span>
);

const Stars = ({ rating, reviews, size = "sm" }: { rating: number; reviews?: number; size?: "xs" | "sm" }) => {
  const sz = size === "xs" ? "h-2.5 w-2.5" : "h-3 w-3";
  const noReviews = !reviews || reviews === 0;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => {
          if (noReviews) return <Star key={i} className={`${sz} fill-muted text-muted`} />;
          const diff = rating - (i - 1);
          const fill = diff >= 1 ? "full" : diff >= 0.4 ? "half" : "empty";
          return <StarIcon key={i} fill={fill} size={sz} />;
        })}
      </div>
      {reviews !== undefined && reviews > 0 && (
        <span className="text-[10px] text-muted-foreground font-normal">({reviews})</span>
      )}
    </div>
  );
};

const PriceBlock = ({ price, originalPrice, compact = false }: { price: number; originalPrice?: number; compact?: boolean }) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const pct = hasDiscount ? Math.round((1 - price / originalPrice) * 100) : 0;

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{formatUAH(price)}</p>
          {hasDiscount && <p className="text-[10px] text-muted-foreground line-through leading-none mt-0.5">{formatUAH(originalPrice)}</p>}
        </div>
        {hasDiscount && (
          <span className="shrink-0 rounded-md bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">-{pct}%</span>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <p className="text-xl font-semibold text-foreground">{formatUAH(price)}</p>
        {hasDiscount && (
          <span className="rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">-{pct}%</span>
        )}
      </div>
      {hasDiscount && (
        <p className="text-sm text-muted-foreground line-through mt-0.5">{formatUAH(originalPrice)}</p>
      )}
    </div>
  );
};

const ProductCardInner = ({ product, compact = false, categoryName }: ProductCardProps) => {
  const { addItem } = useCart();
  const [selectedVarIdx, setSelectedVarIdx] = useState(0);

  const variants = product.variants ?? [];
  const selectedVar = variants[selectedVarIdx] as ProductVariant | undefined;
  const displayPrice = selectedVar?.price ?? product.price;
  const hasDiscount = product.originalPrice && product.originalPrice > displayPrice;

  if (compact) {
    return (
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card h-full">
        <Link to={`/product/${product.slug ?? product.id}`} className="relative overflow-hidden bg-secondary/20">
          <div className="aspect-[4/3] grid place-items-center p-3">
            {product.images?.[0] ? (
              <OptimizedImage
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 200px"
                quality={75}
              />
            ) : (
              <div className="h-full w-full rounded-lg bg-secondary/60" />
            )}
          </div>
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.badge && (
              <span className="rounded-md bg-primary/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                {product.badge === "Хіт продажів" ? "Хіт" : product.badge}
              </span>
            )}
          </div>
        </Link>
        <div className="flex flex-col flex-1 gap-1.5 p-3">
          {categoryName && <span className="text-[9px] uppercase tracking-[0.15em] text-primary/60 font-medium line-clamp-1">{categoryName}</span>}
          <Link to={`/product/${product.slug ?? product.id}`} className="line-clamp-2 text-xs font-medium leading-snug text-foreground hover:text-primary transition-colors">
            {product.name}
          </Link>
          <Stars rating={product.rating} reviews={product.reviews} size="xs" />
          {variants.length > 1 && (
            <VariantChips variants={variants} selectedIdx={selectedVarIdx} onSelect={setSelectedVarIdx} max={4} />
          )}
          <div className="mt-auto pt-2 space-y-2">
            <PriceBlock price={displayPrice} originalPrice={product.originalPrice} compact />
            <Button onClick={() => addItem(product, 1, selectedVar)} size="sm"
              className="w-full h-8 rounded-full btn-aura border-0 text-[10px] font-medium gap-1 touch-manipulation">
              <ShoppingCart className="h-3 w-3 shrink-0" />
              До кошика
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <Link to={`/product/${product.slug ?? product.id}`} className="relative overflow-hidden bg-secondary/20">
        <div className="aspect-square grid place-items-center p-4 sm:p-6">
          {product.images?.[0] ? (
            <OptimizedImage
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 45vw, (max-width: 1280px) 23vw, 280px"
              quality={80}
            />
          ) : (
            <div className="h-full w-full rounded-xl bg-secondary/60" />
          )}
        </div>
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {product.badge && (
            <span className="rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              {product.badge === "Хіт продажів" ? "Хіт" : product.badge}
            </span>
          )}
          {hasDiscount && (() => {
            const pct = Math.round((1 - product.price / product.originalPrice!) * 100);
            return (
              <span className="rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">-{pct}%</span>
            );
          })()}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        {categoryName && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-primary/70 font-medium line-clamp-1">{categoryName}</span>
        )}
        <Link to={`/product/${product.slug ?? product.id}`} className="line-clamp-2 text-sm font-medium leading-snug text-foreground hover:text-primary transition-colors">
          {product.name}
        </Link>
        <Stars rating={product.rating} reviews={product.reviews} />
        {variants.length > 1 && (
          <VariantChips variants={variants} selectedIdx={selectedVarIdx} onSelect={setSelectedVarIdx} max={6} />
        )}
        <div className="mt-auto pt-2 space-y-2.5">
          <PriceBlock price={displayPrice} originalPrice={product.originalPrice} />
          <Button onClick={() => addItem(product, 1, selectedVar)}
            className="w-full h-10 rounded-full btn-aura border-0 text-xs font-medium gap-1.5 touch-manipulation">
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            До кошика
          </Button>
        </div>
      </div>
    </article>
  );
};

export const ProductCard = memo(ProductCardInner);
