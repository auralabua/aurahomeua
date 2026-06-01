import { useMemo } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import { Check, Phone, MessageCircle, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatUAH } from "@/data/products";
import { useSEO } from "@/hooks/useSEO";
import { useProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";
import { ProductCard } from "@/components/ProductCard";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
  variant?: string | null;
}

interface OrderState {
  order_reference: string;
  customer_name: string;
  phone: string;
  city: string;
  branch: string;
  delivery: string;
  payment: string;
  items: OrderItem[];
  total: number;
}

const STEPS = [
  { n: 1, title: "Підтвердження", desc: "Зателефонуємо протягом 1–2 годин" },
  { n: 2, title: "Відправка",     desc: "Передамо в Нову Пошту за 1–2 дні" },
  { n: 3, title: "Доставка",      desc: "Нова Пошта доставить за 1–3 дні" },
  { n: 4, title: "Отримання",     desc: "Перевірте й оплатіть при отриманні" },
];

const OrderSuccess = () => {
  useSEO({ title: "Замовлення оформлено — BodyHome", url: "/order-success", noindex: true });
  const { state } = useLocation() as { state: OrderState | null };
  const { products } = useProductsAsLegacy();
  const { categories } = useCategoriesAsLegacy();

  const categoryNameById = useMemo(
    () => new Map(categories.map(c => [c.id, c.name])),
    [categories]
  );

  const recommendedProducts = useMemo(() => {
    if (!state?.items?.length || !products.length) return [];
    const orderedIds = new Set(state.items.map(i => i.id));
    const orderedCategories = new Set<string>();
    state.items.forEach(item => {
      const p = products.find(p => p.id === item.id);
      if (p?.category) orderedCategories.add(p.category);
    });
    if (!orderedCategories.size) return [];
    return products
      .filter(p => orderedCategories.has(p.category) && !orderedIds.has(p.id) && p.available)
      .slice(0, 4);
  }, [products, state]);

  if (!state?.order_reference) return <Navigate to="/catalog" replace />;

  const isCOD = state.payment === "cod";
  const deliveryLabel = state.delivery === "novaposhta" ? "Нова Пошта" : "Meest / Rozetka";
  const paymentLabel = isCOD ? "Накладений платіж" : "Онлайн оплата";

  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-primary/5 border-b border-primary/10 py-14 sm:py-20 text-center">
        <div className="container max-w-xl">
          <div className="success-check mx-auto mb-7">
            <Check className="h-11 w-11" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium mb-3">Дякуємо за замовлення!</h1>
          <p className="text-muted-foreground">
            Замовлення{" "}
            <span className="font-semibold text-primary">#{state.order_reference}</span>{" "}
            успішно оформлено
          </p>
          <p className="text-sm text-muted-foreground mt-1">Менеджер зв'яжеться з вами для підтвердження</p>
        </div>
      </div>

      <div className="container max-w-5xl py-10 space-y-10">

        {/* ── Order details ─────────────────────────────────────────────── */}
        <div className="success-section grid md:grid-cols-2 gap-5" style={{ "--delay": "0.15s" } as React.CSSProperties}>

          {/* Contact + delivery */}
          <div className="rounded-2xl bg-white border border-border/40 p-6 space-y-4">
            <h2 className="font-semibold">Деталі замовлення</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 grid place-items-center">
                  <span className="text-[10px] font-bold text-primary leading-none">ФІО</span>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Отримувач</dt>
                  <dd className="font-medium">{state.customer_name}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 grid place-items-center">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Телефон</dt>
                  <dd className="font-medium">{state.phone}</dd>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 grid place-items-center">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Доставка</dt>
                  <dd className="font-medium">{deliveryLabel}</dd>
                  {state.city   && <dd className="text-xs text-muted-foreground">{state.city}</dd>}
                  {state.branch && <dd className="text-xs text-muted-foreground">{state.branch}</dd>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 grid place-items-center">
                  <span className="text-sm font-semibold text-primary leading-none">₴</span>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Оплата</dt>
                  <dd className="font-medium">{paymentLabel}</dd>
                </div>
              </div>
            </dl>
          </div>

          {/* Items list */}
          <div className="rounded-2xl bg-white border border-border/40 p-6">
            <h2 className="font-semibold mb-4">Товари</h2>
            <ul className="space-y-3 max-h-52 overflow-y-auto pr-1">
              {state.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <div className="h-11 w-11 shrink-0 rounded-lg bg-secondary/50 grid place-items-center overflow-hidden">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="h-full w-full object-contain p-1" />
                      : <ShoppingBag className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-2 font-light">{item.name}</p>
                    <p className="text-muted-foreground text-xs">{item.quantity} × {formatUAH(item.price)}</p>
                  </div>
                  <p className="font-medium whitespace-nowrap">{formatUAH(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-border/40 mt-4 pt-4 flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Разом</span>
              <span className="text-2xl font-bold text-primary">{formatUAH(state.total)}</span>
            </div>
          </div>
        </div>

        {/* ── What's next timeline ──────────────────────────────────────── */}
        <div className="success-section" style={{ "--delay": "0.25s" } as React.CSSProperties}>
          <h2 className="text-xl font-medium mb-8 text-center">Що далі?</h2>
          <div className="relative grid sm:grid-cols-4 gap-6 sm:gap-0">
            {/* Horizontal connector — desktop only */}
            <div className="hidden sm:block absolute top-5 left-[12.5%] right-[12.5%] h-px bg-border/70" />
            {STEPS.map(step => (
              <div key={step.n} className="relative flex sm:flex-col items-start sm:items-center sm:text-center gap-4 sm:gap-3 sm:px-2">
                <div className="shrink-0 z-10 h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-bold shadow-sm">
                  {step.n}
                </div>
                <div>
                  <p className="font-semibold text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact block ─────────────────────────────────────────────── */}
        <div className="success-section rounded-2xl bg-white border border-border/40 p-6" style={{ "--delay": "0.35s" } as React.CSSProperties}>
          <h2 className="font-semibold mb-1">Є питання щодо замовлення?</h2>
          <p className="text-sm text-muted-foreground mb-4">Звертайтесь — відповімо швидко</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-xl gap-2 hover:border-[#229ED9]/50 hover:text-[#229ED9]">
              <a href="https://t.me/bodyhomeua" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> Telegram
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-xl gap-2 hover:border-primary/50 hover:text-primary">
              <a href="tel:+380956981124">
                <Phone className="h-4 w-4" /> +38 095 698 11 24
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-xl gap-2 hover:border-purple-400/50 hover:text-purple-600">
              <a href="viber://chat?number=%2B380956981124">
                <MessageCircle className="h-4 w-4" /> Viber
              </a>
            </Button>
          </div>
        </div>

        {/* ── Recommended products ──────────────────────────────────────── */}
        {recommendedProducts.length > 0 && (
          <div className="success-section" style={{ "--delay": "0.45s" } as React.CSSProperties}>
            <div className="text-center mb-6">
              <p className="aura-kicker mb-1">поки чекаєте</p>
              <h2 className="text-xl font-medium">Вам також може сподобатись</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {recommendedProducts.map(p => (
                <ProductCard key={p.id} product={p} categoryName={categoryNameById.get(p.category)} />
              ))}
            </div>
          </div>
        )}

        {/* ── Bottom CTA ────────────────────────────────────────────────── */}
        <div className="success-section text-center pb-6" style={{ "--delay": "0.5s" } as React.CSSProperties}>
          <Button asChild size="lg" className="rounded-full btn-aura border-0">
            <Link to="/catalog">Повернутись до каталогу</Link>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
