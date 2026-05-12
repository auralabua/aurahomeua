import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, CreditCard, Headphones, Star, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { useProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";

const HERO_IMG = "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=900&q=85&auto=format&fit=crop";

const reviews = [
  { name: "Ірина К.", city: "Київ", text: "Ортопедична подушка змінила якість сну. Спина перестала боліти вже за тиждень.", rating: 5 },
  { name: "Олександр П.", city: "Львів", text: "Масажер для спини — найкраща інвестиція в себе. Рекомендую всім хто сидить за комп'ютером.", rating: 5 },
  { name: "Марія С.", city: "Одеса", text: "Аплікатор Кузнєцова допомагає після довгого робочого дня. Ефект відчутний одразу.", rating: 5 },
];

const trust = [
  { icon: Truck, title: "Доставка по Україні", desc: "Нова Пошта, Meest, Укрпошта" },
  { icon: ShieldCheck, title: "Гарантія якості", desc: "Перевірені товари" },
  { icon: CreditCard, title: "Зручна оплата", desc: "Картка або накладений платіж" },
  { icon: Headphones, title: "Підтримка", desc: "Telegram, Viber, телефон" },
  { icon: RotateCcw, title: "Легке повернення", desc: "Протягом 14 днів" },
];

const Index = () => {
  const { products } = useProductsAsLegacy();
  const { categories: allCats } = useCategoriesAsLegacy();
  const categories = allCats.filter(c => !c.parentId);
  const featured = [...products.filter(p => p.badge === "Хіт продажів"), ...products.filter(p => !p.badge)].slice(0, 8);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-bg">
        <div className="container grid min-h-[620px] items-center gap-12 py-16 lg:grid-cols-2">
          {/* Left */}
          <div className="space-y-8 max-w-2xl">
            <p className="aura-kicker">Wellness для вашого дому</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.04] text-foreground">
              Комфорт.<br />Відновлення.<br />Якість життя.
            </h1>
            <p className="text-lg md:text-xl font-light leading-relaxed text-muted-foreground max-w-lg">
              Ортопедичні товари, масажери та wellness-девайси для щоденного догляду за собою — з доставкою по всій Україні.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="h-12 rounded-full btn-aura border-0 font-light px-8">
                <Link to="/catalog">Переглянути колекцію <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full font-light px-8 border-border/60 bg-white/60 hover:bg-white text-foreground">
                <a href="#featured">Популярні товари</a>
              </Button>
            </div>
          </div>

          {/* Right — hero image */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-primary/8 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-white shadow-elevated">
              <img
                src={HERO_IMG}
                alt="Wellness lifestyle"
                className="aspect-[4/3] w-full object-cover"
                loading="eager"
                onError={e => { e.currentTarget.style.display = "none"; }}
              />
              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 right-5 glass rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-light text-foreground">Перевірені wellness-товари</p>
                    <p className="text-xs text-muted-foreground">для спини, сну, постави та відновлення</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-y border-border/60 bg-white/50">
        <div className="container py-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {trust.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/8">
                  <t.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{t.title}</p>
                  <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="container py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="aura-kicker mb-3">каталог</p>
            <h2 className="text-4xl md:text-5xl font-light">Категорії товарів</h2>
            <p className="mt-2 text-muted-foreground font-light">Оберіть потрібний напрямок</p>
          </div>
          <Link to="/catalog" className="hidden items-center gap-2 text-sm text-primary font-light transition-smooth hover:gap-3 sm:flex">
            Усі товари <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {categories.map(c => <CategoryCard key={c.id} category={c} />)}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section id="featured" className="bg-secondary/40 py-20">
        <div className="container">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="aura-kicker mb-3">рекомендовано</p>
              <h2 className="text-4xl md:text-5xl font-light">Популярні товари</h2>
            </div>
            <Link to="/catalog" className="hidden items-center gap-2 text-sm text-primary font-light transition-smooth hover:gap-3 sm:flex">
              Всі товари <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="aura-kicker mb-4">наш підхід</p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight">
              Wellness — це щоденна турбота про себе
            </h2>
            <p className="mt-6 text-base font-light leading-relaxed text-muted-foreground">
              Ми зібрали перевірені ортопедичні товари, масажери та wellness-девайси для тих, хто цінує якість і комфорт. Без зайвого — тільки те, що справді допомагає.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Товари від перевірених виробників",
                "Консультація щодо вибору",
                "Швидка доставка по всій Україні",
                "Легке повернення протягом 14 днів",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/12">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-sm font-light text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "715+", label: "товарів в каталозі" },
              { num: "UA", label: "доставка по Україні" },
              { num: "14", label: "днів на повернення" },
              { num: "7/7", label: "дні підтримки" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-white/70 p-6 text-center">
                <p className="text-4xl font-light text-primary">{s.num}</p>
                <p className="mt-2 text-xs text-muted-foreground font-light">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="bg-secondary/40 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="aura-kicker mb-3">відгуки</p>
            <h2 className="text-4xl md:text-5xl font-light">Клієнти про нас</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {reviews.map((r, i) => (
              <div key={i} className="rounded-2xl border border-border/40 bg-white p-7">
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80 font-light">"{r.text}"</p>
                <div className="mt-6 pt-5 border-t border-border/40">
                  <p className="text-sm font-light text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY + PAYMENT ── */}
      <section className="container py-16 grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-border/40 bg-white p-8">
          <Truck className="h-6 w-6 text-primary mb-5" strokeWidth={1.5} />
          <h3 className="text-xl font-light mb-4">Доставка</h3>
          <ul className="space-y-2.5 text-sm font-light text-muted-foreground">
            {["Нова Пошта — відділення або кур'єром", "Meest Express — по Україні", "Укрпошта — по всій Україні"].map((item, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />{item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border/40 bg-white p-8">
          <CreditCard className="h-6 w-6 text-primary mb-5" strokeWidth={1.5} />
          <h3 className="text-xl font-light mb-4">Оплата</h3>
          <ul className="space-y-2.5 text-sm font-light text-muted-foreground">
            {["Накладений платіж — оплата при отриманні", "LiqPay — карткою онлайн", "Monobank та ПриватБанк"].map((item, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />{item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Index;
