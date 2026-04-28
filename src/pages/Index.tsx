import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, CreditCard, Headphones, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/products";
import heroImg from "@/assets/hero.jpg";

const reviews = [
  { name: "Ірина К.", city: "Київ", text: "Подушка з ефектом пам'яті — найкраща покупка року! Спина перестала боліти, сплю як немовля.", rating: 5 },
  { name: "Олександр П.", city: "Львів", text: "Замовив бандаж на коліно — швидка доставка Новою Поштою, якість на висоті. Дякую OLVI!", rating: 5 },
  { name: "Марія С.", city: "Одеса", text: "Купила килимок аплікатор — чудовий ефект після 10 хвилин на день. Рекомендую!", rating: 5 },
];

const featured = products.filter(p => p.badge === "Хіт продажів").slice(0, 4);

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/70 backdrop-blur text-xs font-medium text-primary shadow-soft">
              <ShieldCheck className="h-3.5 w-3.5" /> Сертифіковані медичні товари
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Здоров'я та комфорт <br />
              <span className="bg-clip-text text-transparent gradient-primary">для всієї родини</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              OLVI — ваш надійний помічник у щоденному догляді за здоров'ям. Ортопедичні товари, масажери, ортези та засоби для краси з гарантією якості.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full gradient-primary border-0 shadow-glow hover:opacity-95">
                <Link to="/catalog">Перейти до каталогу <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <Link to="/about">Про нас</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 -z-10 blur-3xl gradient-primary opacity-20 rounded-full" />
            <img
              src={heroImg}
              alt="Ортопедичні товари OLVI"
              width={1536}
              height={1024}
              className="rounded-3xl shadow-elevated w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="container py-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Truck, title: "Швидка доставка", desc: "По всій Україні" },
          { icon: ShieldCheck, title: "Гарантія якості", desc: "Сертифіковані товари" },
          { icon: CreditCard, title: "Зручна оплата", desc: "Картка або при отриманні" },
          { icon: Headphones, title: "Підтримка 7 днів", desc: "Завжди на зв'язку" },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-card shadow-soft border border-border/50">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent">
              <f.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">{f.title}</div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="container py-14">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl">Категорії товарів</h2>
            <p className="text-muted-foreground mt-2">Оберіть потрібну категорію</p>
          </div>
          <Link to="/catalog" className="text-primary text-sm font-medium hidden sm:inline-flex items-center gap-1 hover:gap-2 transition-smooth">
            Усі товари <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {categories.map(c => <CategoryCard key={c.id} category={c} />)}
        </div>
      </section>

      {/* Featured */}
      <section className="container py-14">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl">Популярні товари</h2>
            <p className="text-muted-foreground mt-2">Хіти продажів від OLVI</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-secondary/40 py-16 mt-10">
        <div className="container">
          <h2 className="text-3xl md:text-4xl text-center">Відгуки наших клієнтів</h2>
          <p className="text-muted-foreground text-center mt-2">Тисячі задоволених клієнтів по всій Україні</p>
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {reviews.map((r, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card shadow-soft border border-border/50">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">"{r.text}"</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery & Payment */}
      <section className="container py-16 grid md:grid-cols-2 gap-6">
        <div className="p-8 rounded-3xl gradient-soft border border-border/60 shadow-soft">
          <Truck className="h-8 w-8 text-primary mb-4" />
          <h3 className="text-2xl mb-4">Доставка</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Нова Пошта — у відділення або кур'єром</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Укрпошта — по всій Україні</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Meest — швидка доставка</li>
          </ul>
        </div>
        <div className="p-8 rounded-3xl gradient-soft border border-border/60 shadow-soft">
          <CreditCard className="h-8 w-8 text-primary mb-4" />
          <h3 className="text-2xl mb-4">Оплата</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Оплата при отриманні</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> LiqPay — карткою онлайн</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Monobank — швидка оплата</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> ПриватБанк — Приват24</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Index;
