import { useState, FormEvent, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, Package, CreditCard, Wallet, Check, Loader2 } from "lucide-react";
import { z } from "zod";
import { useCart } from "@/context/CartContext";
import { formatUAH } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";

// ── Nova Poshta API ──────────────────────────────────────────────────────────

const NP_API_KEY = "834e3cb96a88d90edb794d24aec1191";

interface NPCity {
  Ref: string;
  Description: string;
  RegionsDescription: string;
  SettlementTypeDescription?: string;
}

interface NPWarehouse {
  Ref: string;
  Description: string;
}

async function npPost<T>(modelName: string, calledMethod: string, props: object): Promise<T[]> {
  try {
    const res = await fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: NP_API_KEY, modelName, calledMethod, methodProperties: props }),
    });
    const json = await res.json();
    return json.success ? (json.data as T[]) : [];
  } catch {
    return [];
  }
}

// ── Generic autocomplete dropdown ────────────────────────────────────────────

function CityAutocomplete({ id, value, onChange, onSelect }: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  onSelect: (city: NPCity) => void;
}) {
  const [suggestions, setSuggestions] = useState<NPCity[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    setNotFound(false);
    if (value.length < 2) { setSuggestions([]); setOpen(false); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await npPost<NPCity>("Address", "getCities", { FindByString: value, Limit: "10" });
        setSuggestions(data);
        setOpen(data.length > 0);
        setNotFound(data.length === 0);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}
          className="rounded-xl h-11 pr-9"
          placeholder="Починайте вводити місто…"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground pointer-events-none" />
        )}
      </div>
      {notFound && !loading && (
        <p className="text-xs text-muted-foreground mt-1 px-1">Місто не знайдено</p>
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-background shadow-lg max-h-56 overflow-y-auto">
          {suggestions.map(city => (
            <li
              key={city.Ref}
              onMouseDown={() => {
                onChange(city.Description);
                onSelect(city);
                setOpen(false);
                setSuggestions([]);
              }}
              className="flex items-baseline gap-1.5 px-3 py-2.5 cursor-pointer hover:bg-secondary text-sm first:rounded-t-xl last:rounded-b-xl"
            >
              <span className="font-medium">{city.Description}</span>
              {city.SettlementTypeDescription && city.SettlementTypeDescription !== "місто" && (
                <span className="text-muted-foreground text-xs">{city.SettlementTypeDescription}</span>
              )}
              {city.RegionsDescription && (
                <span className="text-muted-foreground text-xs ml-auto shrink-0">
                  {city.RegionsDescription} обл.
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BranchAutocomplete({ id, cityRef, value, onChange }: {
  id?: string;
  cityRef: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<NPWarehouse[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    setNotFound(false);
    if (!cityRef || value.length < 1) { setSuggestions([]); setOpen(false); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await npPost<NPWarehouse>("AddressGeneral", "getWarehouses", {
          CityRef: cityRef,
          FindByString: value,
          Limit: "25",
        });
        setSuggestions(data);
        setOpen(data.length > 0);
        setNotFound(data.length === 0);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [value, cityRef]);

  if (!cityRef) {
    return (
      <Input
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="rounded-xl h-11 text-muted-foreground"
        placeholder="Спочатку оберіть місто"
      />
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}
          className="rounded-xl h-11 pr-9"
          placeholder="Номер або адреса відділення…"
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground pointer-events-none" />
        )}
      </div>
      {notFound && !loading && (
        <p className="text-xs text-muted-foreground mt-1 px-1">Відділення не знайдено</p>
      )}
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-background shadow-lg max-h-56 overflow-y-auto">
          {suggestions.map(w => (
            <li
              key={w.Ref}
              onMouseDown={() => { onChange(w.Description); setOpen(false); setSuggestions([]); }}
              className="px-3 py-2.5 cursor-pointer hover:bg-secondary text-sm first:rounded-t-xl last:rounded-b-xl"
            >
              {w.Description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Checkout ─────────────────────────────────────────────────────────────────

type DeliveryMethod = "novaposhta" | "mistexpress";
type PaymentMethod = "wayforpay" | "cod";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Вкажіть ім'я та прізвище").max(100),
  phone: z.string().trim().min(10, "Невірний номер телефону").max(20),
  email: z.string().trim().email("Невірний email").max(255),
  city: z.string().trim().min(2, "Вкажіть місто"),
  branch: z.string().trim().min(1, "Вкажіть відділення"),
});

function submitWayForPay(params: Record<string, any>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://secure.wayforpay.com/pay";
  form.target = "_top";
  form.acceptCharset = "utf-8";
  form.style.display = "none";
  const add = (name: string, value: string | number | string[] | number[]) => {
    (Array.isArray(value) ? value : [value]).forEach(v => {
      const el = document.createElement("input");
      el.type = "hidden"; el.name = name; el.value = String(v);
      form.appendChild(el);
    });
  };
  Object.entries(params).forEach(([k, v]) => add(k, v as any));
  document.body.appendChild(form);
  form.submit();
}

const Checkout = () => {
  useSEO({ title: "Оформлення замовлення", url: "/checkout", noindex: true });
  const navigate = useNavigate();
  const { items, totalPrice, totalCount, clear } = useCart();
  const [delivery, setDelivery] = useState<DeliveryMethod>("novaposhta");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", city: "", branch: "" });
  const [cityRef, setCityRef] = useState("");

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl mb-3">Кошик порожній</h1>
        <p className="text-muted-foreground mb-6">Додайте товари перед оформленням замовлення</p>
        <Button asChild size="lg" className="rounded-full btn-aura"><Link to="/catalog">До каталогу</Link></Button>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Перевірте поля", description: parsed.error.errors[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const orderRef = `AH-${Date.now()}`;
      const orderItems = items.map(({ product, quantity, selectedVariant }) => ({
        id: product.id,
        name: selectedVariant ? `${product.name} (${selectedVariant.label})` : product.name,
        price: selectedVariant?.price ?? product.price,
        quantity,
        image: product.images?.[0] ?? null,
        variant: selectedVariant?.label ?? null,
      }));

      const { error: dbError } = await supabase.from("orders").insert({
        order_reference: orderRef, amount: totalPrice, currency: "UAH",
        status: "pending", admin_status: "new",
        customer_name: form.fullName, customer_phone: form.phone, customer_email: form.email,
        delivery_address: `${form.city}, ${form.branch}`,
        delivery_method: delivery, delivery_city: form.city, delivery_branch: form.branch,
        payment_method: payment, items: orderItems,
      });
      if (dbError) {
        toast({ title: "Помилка збереження", description: dbError.message, variant: "destructive" });
        return;
      }

      if (payment === "cod") {
        toast({ title: "Замовлення оформлено ✅", description: `№ ${orderRef}. Менеджер зв'яжеться з вами.` });
        clear(); navigate("/"); return;
      }

      const { data: signed, error: signErr } = await supabase.functions.invoke("wayforpay-sign", {
        body: {
          orderReference: orderRef,
          amount: totalPrice,
          items: orderItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        },
      });
      if (signErr || !signed?.merchantSignature) {
        toast({ title: "Помилка платежу", description: signErr?.message || "Не вдалося сформувати підпис", variant: "destructive" });
        return;
      }

      clear();
      submitWayForPay({
        merchantAccount: signed.merchantAccount,
        merchantDomain: signed.merchantDomain,
        merchantSignature: signed.merchantSignature,
        orderReference: signed.orderReference,
        orderDate: signed.orderDate,
        amount: signed.amount,
        currency: signed.currency,
        "productName[]": signed.productName,
        "productCount[]": signed.productCount,
        "productPrice[]": signed.productPrice,
        clientFirstName: form.fullName.split(" ")[0] || form.fullName,
        clientLastName: form.fullName.split(" ")[1] || "",
        clientPhone: form.phone,
        clientEmail: form.email,
        language: "UA",
        returnUrl: "https://www.bodyhome.com.ua/",
      });

    } catch (err: any) {
      toast({ title: "Помилка", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-10 max-w-6xl">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-smooth mb-4">
        <ArrowLeft className="h-4 w-4" /> Повернутися до кошика
      </Link>
      <h1 className="text-3xl md:text-4xl mb-8">Оформлення замовлення</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_380px] gap-8" noValidate>
        <div className="space-y-8">
          {/* Contact info */}
          <section className="p-6 rounded-2xl aura-card">
            <h2 className="text-xl font-medium mb-5">Контактні дані</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="fullName">Ім'я та Прізвище</Label>
                <Input id="fullName" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="rounded-xl h-11" placeholder="Олена Коваленко" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Номер телефону</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="rounded-xl h-11" placeholder="+380 XX XXX XX XX" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="rounded-xl h-11" placeholder="you@example.com" />
              </div>
            </div>
          </section>

          {/* Delivery */}
          <section className="p-6 rounded-2xl aura-card">
            <h2 className="text-xl font-medium mb-5">Спосіб доставки</h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              <OptionCard
                active={delivery === "novaposhta"}
                onClick={() => setDelivery("novaposhta")}
                icon={<Truck className="h-5 w-5" />}
                title="Нова Пошта"
                subtitle="Відділення або поштомат"
              />
              <OptionCard
                active={delivery === "mistexpress"}
                onClick={() => setDelivery("mistexpress")}
                icon={<Package className="h-5 w-5" />}
                title="MistExpress"
                subtitle="Відділення MistExpress"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">Місто</Label>
                {delivery === "novaposhta" ? (
                  <CityAutocomplete
                    id="city"
                    value={form.city}
                    onChange={v => {
                      setForm(f => ({ ...f, city: v, branch: "" }));
                      setCityRef("");
                    }}
                    onSelect={city => setCityRef(city.Ref)}
                  />
                ) : (
                  <Input
                    id="city"
                    value={form.city}
                    onChange={e => setForm({...form, city: e.target.value})}
                    className="rounded-xl h-11"
                    placeholder="Введіть місто"
                  />
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="branch">
                  {delivery === "novaposhta" ? "Відділення або поштомат" : "Відділення MistExpress"}
                </Label>
                {delivery === "novaposhta" ? (
                  <BranchAutocomplete
                    id="branch"
                    cityRef={cityRef}
                    value={form.branch}
                    onChange={v => setForm(f => ({ ...f, branch: v }))}
                  />
                ) : (
                  <Input
                    id="branch"
                    value={form.branch}
                    onChange={e => setForm({...form, branch: e.target.value})}
                    className="rounded-xl h-11"
                    placeholder="№ ..."
                  />
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Оплата доставки при отриманні за тарифами {delivery === "novaposhta" ? "Нової Пошти" : "MistExpress"}
            </p>
          </section>

          {/* Payment */}
          <section className="p-6 rounded-2xl aura-card">
            <h2 className="text-xl font-medium mb-5">Спосіб оплати</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <OptionCard active={payment === "wayforpay"} onClick={() => setPayment("wayforpay")} icon={<CreditCard className="h-5 w-5" />} title="Оплата онлайн" subtitle="Visa, Mastercard через WayForPay" />
              <OptionCard active={payment === "cod"} onClick={() => setPayment("cod")} icon={<Wallet className="h-5 w-5" />} title="При отриманні" subtitle="Накладений платіж" />
            </div>
            {payment === "wayforpay" && (
              <div className="mt-4 p-3 rounded-xl bg-primary/8 text-sm text-primary font-light">
                🔒 Безпечна оплата через WayForPay. Підтримуються всі українські банки.
              </div>
            )}
          </section>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-24 h-fit p-6 rounded-2xl aura-card">
          <h2 className="text-xl font-medium mb-4">Ваше замовлення</h2>
          <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
            {items.map(({ product, quantity, selectedVariant }) => {
              const itemPrice = selectedVariant?.price ?? product.price;
              const varLabel = selectedVariant?.label;
              return (
                <li key={product.id + (varLabel ?? "")} className="flex gap-3 text-sm">
                  <div className="h-12 w-12 shrink-0 rounded-lg bg-secondary overflow-hidden grid place-items-center">
                    {product.images?.[0] && <img src={product.images[0]} alt="" className="h-full w-full object-contain p-1" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="line-clamp-2">{product.name}</div>
                    {varLabel && <div className="text-primary text-[11px] font-medium">Розмір: {varLabel}</div>}
                    <div className="text-muted-foreground text-xs mt-0.5">{quantity} × {formatUAH(itemPrice)}</div>
                  </div>
                  <div className="font-medium whitespace-nowrap">{formatUAH(itemPrice * quantity)}</div>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-border my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Товарів</span><span>{totalCount} шт</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Сума товарів</span><span>{formatUAH(totalPrice)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Доставка</span><span>за тарифами</span></div>
          </div>
          <div className="border-t border-border my-4" />
          <div className="flex justify-between items-baseline mb-5">
            <span className="font-medium">До сплати</span>
            <span className="text-2xl font-light text-primary">{formatUAH(totalPrice)}</span>
          </div>
          <Button type="submit" size="lg" disabled={submitting} className="w-full rounded-full btn-aura border-0">
            {submitting
              ? <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Опрацювання…</span>
              : payment === "wayforpay" ? "Перейти до оплати" : "Підтвердити замовлення"}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            {payment === "wayforpay" ? "🔒 Безпечна оплата WayForPay" : "Оплата при отриманні посилки"}
          </p>
        </aside>
      </form>
    </div>
  );
};

const OptionCard = ({ active, onClick, icon, title, subtitle }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; title: string; subtitle: string;
}) => (
  <button type="button" onClick={onClick} className={cn(
    "relative flex items-start gap-3 text-left p-4 rounded-xl border transition-smooth",
    active ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
  )}>
    <div className={cn("grid h-10 w-10 place-items-center rounded-lg shrink-0", active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground")}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-sm">{title}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
    </div>
    {active && (
      <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground grid place-items-center">
        <Check className="h-3 w-3" />
      </div>
    )}
  </button>
);

export default Checkout;
