import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatUAH } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useProductsAsLegacy } from "@/hooks/useShopData";

const Cart = () => {
  useSEO({ title: "Кошик", url: "/cart", noindex: true });
  const { items, updateQuantity, removeItem, totalPrice, totalCount, clear, addItem } = useCart();
  const { products: allProducts } = useProductsAsLegacy();

  const upsellProducts = useMemo(() => {
    if (!allProducts?.length || !items.length) return [];
    const cartIds = new Set(items.map(i => i.product.id));
    const cartCategories = [...new Set(items.map(i => i.product.category).filter(Boolean))];
    if (!cartCategories.length) return [];
    return allProducts
      .filter(p => cartCategories.includes(p.category) && !cartIds.has(p.id) && p.available)
      .slice(0, 6);
  }, [allProducts, items]);

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <div className="grid h-20 w-20 mx-auto place-items-center rounded-full bg-primary-soft text-primary mb-6">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="text-3xl mb-3">Ваш кошик порожній</h1>
        <p className="text-muted-foreground mb-6">Перегляньте каталог і додайте товари, які вам сподобались</p>
        <Button asChild size="lg" className="rounded-full btn-aura border-0">
          <Link to="/catalog">Перейти до каталогу</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-smooth mb-4">
        <ArrowLeft className="h-4 w-4" /> Продовжити покупки
      </Link>
      <h1 className="text-3xl md:text-4xl mb-8">Ваш кошик</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {items.map(({ product, quantity, selectedVariant }) => {
            const itemPrice = selectedVariant?.price ?? product.price;
            const varLabel = selectedVariant?.label;
            const itemKey = product.id + (varLabel ? `__${varLabel}` : "");
            return (
            <div key={itemKey} className="flex gap-4 p-4 rounded-2xl aura-card">
              <Link to={`/product/${product.id}`} className="grid h-24 w-24 shrink-0 place-items-center rounded-xl gradient-hero overflow-hidden border border-white/10">
                {product.images?.[0] ? (
                  <OptimizedImage src={product.images[0]} alt={product.name} className="h-full w-full object-contain p-2" sizes="96px" quality={70} />
                ) : (
                  <span className="text-xs text-muted-foreground">Фото</span>
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="font-medium hover:text-primary transition-smooth line-clamp-2">
                  {product.name}
                </Link>
                {varLabel && (
                  <div className="text-xs text-primary font-medium mt-0.5">Розмір: {varLabel}</div>
                )}
                <div className="text-sm text-muted-foreground mt-1">{formatUAH(itemPrice)} / шт</div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-full bg-white/[0.055] p-1">
                    <Button variant="ghost" size="icon" className="rounded-full h-7 w-7" onClick={() => updateQuantity(product.id, quantity - 1, varLabel)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
                    <Button variant="ghost" size="icon" className="rounded-full h-7 w-7" onClick={() => updateQuantity(product.id, quantity + 1, varLabel)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="font-bold">{formatUAH(itemPrice * quantity)}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeItem(product.id, varLabel)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit p-6 rounded-2xl aura-card">
          <h2 className="text-xl font-semibold mb-4">Підсумок замовлення</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Товарів</span><span>{totalCount} шт</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Сума</span><span>{formatUAH(totalPrice)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Доставка</span><span className="text-success">за тарифами перевізника</span></div>
          </div>
          <div className="border-t border-white/10 my-4" />
          <div className="flex justify-between items-baseline mb-5">
            <span className="font-semibold">До сплати</span>
            <span className="text-2xl font-bold text-primary">{formatUAH(totalPrice)}</span>
          </div>
          <Button
            asChild
            size="lg"
            className="w-full rounded-full btn-aura border-0 shadow-glow hover:opacity-95"
          >
            <Link to="/checkout">Оформити замовлення</Link>
          </Button>
          <button onClick={clear} className="w-full text-xs text-muted-foreground hover:text-destructive mt-3 transition-smooth">
            Очистити кошик
          </button>
        </aside>
      </div>

      {upsellProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-medium mb-4">З цим товаром часто купують</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible snap-x snap-mandatory">
            {upsellProducts.slice(0, 4).map(p => {
              const hasDisc = p.originalPrice && p.originalPrice > p.price;
              const discPct = hasDisc ? Math.round((1 - p.price / p.originalPrice!) * 100) : 0;
              return (
                <div key={p.id} className="flex-shrink-0 w-44 lg:w-auto snap-start rounded-2xl aura-card overflow-hidden">
                  <Link to={`/product/${p.slug ?? p.id}`} className="relative block aspect-square bg-secondary/20">
                    {p.images?.[0] ? (
                      <OptimizedImage src={p.images[0]} alt={p.name} className="h-full w-full object-contain p-3" sizes="(min-width: 1024px) 25vw, 176px" quality={70} />
                    ) : (
                      <div className="h-full w-full bg-secondary/40" />
                    )}
                    {hasDisc && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-lg px-1.5 py-0.5">-{discPct}%</span>
                    )}
                  </Link>
                  <div className="p-3">
                    <Link to={`/product/${p.slug ?? p.id}`} className="text-sm font-medium line-clamp-2 hover:text-primary transition-smooth">{p.name}</Link>
                    <div className="flex items-center justify-between mt-2 gap-1">
                      <div>
                        <span className="font-bold text-primary text-sm">{formatUAH(p.price)}</span>
                        {hasDisc && <span className="text-xs text-muted-foreground line-through ml-1">{formatUAH(p.originalPrice!)}</span>}
                      </div>
                      <Button size="sm" className="rounded-full btn-aura border-0 h-7 px-2.5 text-xs shrink-0" onClick={() => addItem(p, 1)}>
                        Додати
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default Cart;
