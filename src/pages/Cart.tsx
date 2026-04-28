import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatUAH } from "@/data/products";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalCount, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <div className="grid h-20 w-20 mx-auto place-items-center rounded-full bg-primary-soft text-primary mb-6">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="text-3xl mb-3">Ваш кошик порожній</h1>
        <p className="text-muted-foreground mb-6">Перегляньте каталог і додайте товари, які вам сподобались</p>
        <Button asChild size="lg" className="rounded-full gradient-primary border-0">
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
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-soft">
              <Link to={`/product/${product.id}`} className="grid h-24 w-24 shrink-0 place-items-center rounded-xl gradient-hero text-4xl">
                {product.emoji}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${product.id}`} className="font-medium hover:text-primary transition-smooth line-clamp-2">
                  {product.name}
                </Link>
                <div className="text-sm text-muted-foreground mt-1">{formatUAH(product.price)} / шт</div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-full bg-secondary p-1">
                    <Button variant="ghost" size="icon" className="rounded-full h-7 w-7" onClick={() => updateQuantity(product.id, quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
                    <Button variant="ghost" size="icon" className="rounded-full h-7 w-7" onClick={() => updateQuantity(product.id, quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="font-bold">{formatUAH(product.price * quantity)}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeItem(product.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit p-6 rounded-2xl bg-card border border-border/60 shadow-card">
          <h2 className="text-xl font-semibold mb-4">Підсумок замовлення</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Товарів</span><span>{totalCount} шт</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Сума</span><span>{formatUAH(totalPrice)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Доставка</span><span className="text-success">за тарифами перевізника</span></div>
          </div>
          <div className="border-t border-border my-4" />
          <div className="flex justify-between items-baseline mb-5">
            <span className="font-semibold">До сплати</span>
            <span className="text-2xl font-bold text-primary">{formatUAH(totalPrice)}</span>
          </div>
          <Button
            size="lg"
            className="w-full rounded-full gradient-primary border-0 shadow-glow hover:opacity-95"
            onClick={() => {
              toast({ title: "Замовлення оформлено", description: "Наш менеджер зв'яжеться з вами найближчим часом." });
              clear();
            }}
          >
            Оформити замовлення
          </Button>
          <button onClick={clear} className="w-full text-xs text-muted-foreground hover:text-destructive mt-3 transition-smooth">
            Очистити кошик
          </button>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
