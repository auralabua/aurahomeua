import { useState, FormEvent } from "react";
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

type DeliveryMethod = "novaposhta" | "mistexpress";
type PaymentMethod = "wayforpay" | "cod";

const MERCHANT_ACCOUNT = "aurahomeua_com";
const MERCHANT_DOMAIN = "aurahomeua.lovable.app";
const MERCHANT_SECRET = "4122f3c7c6aa3d8627fb436a2fc76885a87ae1e1";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Вкажіть ім'я та прізвище").max(100),
  phone: z.string().trim().min(10, "Невірний номер телефону").max(20),
  email: z.string().trim().email("Невірний email").max(255),
  city: z.string().trim().min(2, "Вкажіть місто").max(100),
  branch: z.string().trim().min(1, "Вкажіть відділення").max(100),
});

// MD5 для підпису WayForPay
function md5(input: string): string {
  const msg = new TextEncoder().encode(input);
  let [a, b, c, d] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  const S = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  const K = Array.from({length:64},(_,i)=>Math.floor(Math.abs(Math.sin(i+1))*2**32)>>>0);
  const padded = new Uint8Array(Math.ceil((msg.length+9)/64)*64);
  padded.set(msg); padded[msg.length]=0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length-8,msg.length*8,true);
  const add=(x:number,y:number)=>((x+y)&0xFFFFFFFF)>>>0;
  const rotl=(x:number,n:number)=>((x<<n)|(x>>>(32-n)))>>>0;
  for(let i=0;i<padded.length;i+=64){
    const W=Array.from({length:16},(_,j)=>view.getUint32(i+j*4,true));
    let[A,B,C,D]=[a,b,c,d];
    for(let j=0;j<64;j++){
      let[F,g]=[0,0];
      if(j<16){F=((B&C)|(~B&D))>>>0;g=j;}
      else if(j<32){F=((D&B)|(~D&C))>>>0;g=(5*j+1)%16;}
      else if(j<48){F=(B^C^D)>>>0;g=(3*j+5)%16;}
      else{F=(C^(B|(~D>>>0)))>>>0;g=(7*j)%16;}
      const tmp=D;D=C;C=B;
      B=add(B,rotl(add(add(A,F),add(K[j],W[g])),S[j]));
      A=tmp;
    }
    a=add(a,A);b=add(b,B);c=add(c,C);d=add(d,D);
  }
  const result=new Uint8Array(16);
  [a,b,c,d].forEach((v,i)=>{const dv=new DataView(result.buffer,i*4);dv.setUint32(0,v,true);});
  return Array.from(result).map(b=>b.toString(16).padStart(2,"0")).join("");
}

function hmacMd5(key: string, data: string): string {
  const enc = new TextEncoder();
  let keyBytes = enc.encode(key);
  if (keyBytes.length > 64) keyBytes = enc.encode(md5(key));
  const padded = new Uint8Array(64);
  padded.set(keyBytes);
  const iPad = padded.map(b => b ^ 0x36);
  const oPad = padded.map(b => b ^ 0x5c);
  const dataBytes = enc.encode(data);
  const inner = new Uint8Array(iPad.length + dataBytes.length);
  inner.set(iPad); inner.set(dataBytes, iPad.length);
  const innerHex = md5(String.fromCharCode(...inner));
  const innerBytes = new Uint8Array(innerHex.match(/../g)!.map(h => parseInt(h, 16)));
  const outer = new Uint8Array(oPad.length + innerBytes.length);
  outer.set(oPad); outer.set(innerBytes, oPad.length);
  return md5(String.fromCharCode(...outer));
}

function submitWayForPay(params: Record<string, any>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://secure.wayforpay.com/pay";
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
  const navigate = useNavigate();
  const { items, totalPrice, totalCount, clear } = useCart();
  const [delivery, setDelivery] = useState<DeliveryMethod>("novaposhta");
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", city: "", branch: "" });

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
      const orderItems = items.map(({ product, quantity }) => ({
        id: product.id, name: product.name, price: product.price, quantity,
        image: product.images?.[0] ?? null,
      }));

      // Зберегти замовлення в Supabase
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

      // WayForPay підпис
      const orderDate = Math.floor(Date.now() / 1000);
      const productNames = orderItems.map(i => i.name);
      const productCounts = orderItems.map(i => i.quantity);
      const productPrices = orderItems.map(i => i.price);

      const signString = [
        MERCHANT_ACCOUNT, MERCHANT_DOMAIN, orderRef, orderDate,
        totalPrice, "UAH",
        ...productNames, ...productCounts, ...productPrices,
      ].join(";");

      const signature = hmacMd5(MERCHANT_SECRET, signString);

      clear();
      submitWayForPay({
        merchantAccount: MERCHANT_ACCOUNT,
        merchantDomain: MERCHANT_DOMAIN,
        merchantSignature: signature,
        orderReference: orderRef,
        orderDate,
        amount: totalPrice,
        currency: "UAH",
        "productName[]": productNames,
        "productCount[]": productCounts,
        "productPrice[]": productPrices,
        clientFirstName: form.fullName.split(" ")[0] || form.fullName,
        clientLastName: form.fullName.split(" ")[1] || "",
        clientPhone: form.phone,
        clientEmail: form.email,
        language: "UA",
        returnUrl: "https://aurahomeua.lovable.app/",
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

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-8">
          <section className="p-6 rounded-2xl aura-card">
            <h2 className="text-xl font-medium mb-5">Контактні дані</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="fullName">Ім'я та Прізвище</Label>
                <Input id="fullName" required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="rounded-xl h-11" placeholder="Олена Коваленко" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Номер телефону</Label>
                <Input id="phone" type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="rounded-xl h-11" placeholder="+380 XX XXX XX XX" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="rounded-xl h-11" placeholder="you@example.com" />
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl aura-card">
            <h2 className="text-xl font-medium mb-5">Спосіб доставки</h2>
            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              <OptionCard active={delivery === "novaposhta"} onClick={() => setDelivery("novaposhta")} icon={<Truck className="h-5 w-5" />} title="Нова Пошта" subtitle="Відділення або поштомат" />
              <OptionCard active={delivery === "mistexpress"} onClick={() => setDelivery("mistexpress")} icon={<Package className="h-5 w-5" />} title="MistExpress" subtitle="Відділення MistExpress" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city">Місто</Label>
                <Input id="city" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="rounded-xl h-11" placeholder="Київ" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="branch">{delivery === "novaposhta" ? "Відділення або поштомат" : "Відділення MistExpress"}</Label>
                <Input id="branch" required value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} className="rounded-xl h-11" placeholder="№ ..." />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Оплата доставки при отриманні за тарифами {delivery === "novaposhta" ? "Нової Пошти" : "MistExpress"}
            </p>
          </section>

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

        <aside className="lg:sticky lg:top-24 h-fit p-6 rounded-2xl aura-card">
          <h2 className="text-xl font-medium mb-4">Ваше замовлення</h2>
          <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-3 text-sm">
                <div className="h-12 w-12 shrink-0 rounded-lg bg-secondary overflow-hidden grid place-items-center">
                  {product.images?.[0] && <img src={product.images[0]} alt="" className="h-full w-full object-contain p-1" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="line-clamp-2">{product.name}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{quantity} × {formatUAH(product.price)}</div>
                </div>
                <div className="font-medium whitespace-nowrap">{formatUAH(product.price * quantity)}</div>
              </li>
            ))}
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
