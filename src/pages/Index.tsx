import { Link } from "react-router-dom";
import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, CreditCard, Headphones, Star, RotateCcw, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { useProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";

const HERO_IMGS = [
  "https://images.unsplash.com/photo-1544991936-9464fa57a94f?w=600&q=85&auto=format&fit=crop",  // масаж спини
  "https://images.unsplash.com/photo-1616279969856-759f316a5ac1?w=600&q=85&auto=format&fit=crop",  // foam roller
  "https://images.unsplash.com/photo-1601925228154-d944af3e4754?w=600&q=85&auto=format&fit=crop",  // wellness/relax
  "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=85&auto=format&fit=crop",  // масаж
];
const HERO_IMG = HERO_IMGS[0];

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

const articles = [
  {
    tag: "Здоров'я спини",
    title: "Чому болить спина і як допомагає ортопедія",
    text: "Сидяча робота, неправильна постава, відсутність руху — все це призводить до болю в спині. Ортопедичні подушки та масажери допомагають зняти напругу і відновити природне положення хребта.",
    link: "/catalog?category=ortopedychni-podushky",
    emoji: "🦴",
    bg: "from-[#F5EFE6] to-[#EDE3D5]",
    accent: "#8A6440",
  },
  {
    tag: "Відновлення",
    title: "Масаж вдома: як відновитись після важкого дня",
    text: "Регулярний самомасаж покращує кровообіг, знімає м'язову напругу і допомагає тілу відновитись. Масажні мати та ролики — прості інструменти для щоденного догляду.",
    link: "/catalog?category=masazhery",
    emoji: "💆",
    bg: "from-[#EAF2E8] to-[#D8EAD5]",
    accent: "#3D7A55",
  },
  {
    tag: "Якість сну",
    title: "Як правильна подушка впливає на якість сну",
    text: "Під час сну хребет має зберігати природне положення. Ортопедична подушка підтримує шийний відділ і запобігає ранковому болю. Правильний вибір — інвестиція в здоров'я.",
    link: "/catalog?category=ortopedychni-podushky",
    emoji: "🌙",
    bg: "from-[#E8EDF5] to-[#D5DEEA]",
    accent: "#3D5A8A",
  },
  {
    tag: "Дитяча ортопедія",
    title: "Ортопедія для дітей: коли починати та що обирати",
    text: "Дитячий хребет і стопи формуються до 12 років. Правильні устілки, ортопедичні подушки та розвиваючі масажні килимки допомагають запобігти плоскостопості та порушенням постави.",
    link: "/catalog?category=rozvyvaiuchi-ihrashky",
    emoji: "🧸",
    bg: "from-[#F5F0E0] to-[#EAE5CC]",
    accent: "#7A6A20",
  },
];

const needs = [
  { icon: "🦴", label: "Болить спина", link: "/catalog?category=ortopedychni-podushky", color: "bg-[#F5EFE6] hover:bg-[#EDE3D5]" },
  { icon: "🦶", label: "Втомлюються ноги", link: "/catalog?category=ortopedychni-ustilky", color: "bg-[#EAF2E8] hover:bg-[#D8EAD5]" },
  { icon: "🌙", label: "Поганий сон", link: "/catalog?category=ortopedychni-podushky", color: "bg-[#E8EDF5] hover:bg-[#D5DEEA]" },
  { icon: "💆", label: "Стрес і напруга", link: "/catalog?category=masazhery", color: "bg-[#F0EAE8] hover:bg-[#E5D8D5]" },
  { icon: "🦵", label: "Реабілітація", link: "/catalog?category=ortezy-i-bandazhi", color: "bg-[#F0E8F0] hover:bg-[#E5D5E5]" },
  { icon: "🧘", label: "Активність і фітнес", link: "/catalog?category=ortopedychni-masazhni-kylymky", color: "bg-[#F5F0E0] hover:bg-[#EAE5CC]" },
];


const FeaturedCarousel = ({ products }: { products: any[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("article");
    const w = card ? card.offsetWidth + 16 : 240;
    scrollRef.current.scrollBy({ left: dir === "right" ? w * 2 : -w * 2, behavior: "smooth" });
  };

  return (
    <section id="featured" className="bg-secondary/40 py-12 sm:py-20">
      <div className="container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="aura-kicker mb-3">рекомендовано</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light">Популярні товари</h2>
          </div>
          <Link to="/catalog" className="hidden items-center gap-2 text-sm text-primary font-light transition-smooth hover:gap-3 sm:flex shrink-0">
            Всі товари <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Carousel with side arrows */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Left arrow */}
        <button onClick={() => scroll("left")}
          className="absolute left-0 sm:left-1 top-1/2 -translate-y-8 z-10 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white shadow-md border border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        {/* Right arrow */}
        <button onClick={() => scroll("right")}
          className="absolute right-0 sm:right-1 top-1/2 -translate-y-8 z-10 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white shadow-md border border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-3 mx-6 sm:mx-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map(p => (
            <div key={p.id} className="shrink-0 w-[calc(25%-10px)] min-w-[160px] max-w-[240px]">
              <ProductCard product={p} compact />
            </div>
          ))}
        </div>
      </div>

      <div className="container mt-3">
        <Link to="/catalog" className="flex items-center gap-2 text-sm text-primary font-light sm:hidden">
          Всі товари <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

const Index = () => {
  const { products } = useProductsAsLegacy();
  const { categories: allCats } = useCategoriesAsLegacy();
  const categories = allCats.filter(c => !c.parentId);
  // 2-3 товари з кожної категорії (топ-категорії)
  const featuredCatSlugs = [
    "tovary-dlia-krasy", "ortopedychni-podushky", "masazhery",
    "ortopedychni-masazhni-kylymky", "ortezy-i-bandazhi",
    "rozvyvaiuchi-ihrashky", "ortopedychni-ustilky",
  ];
  const featured = featuredCatSlugs.flatMap(slug =>
    products.filter(p => p.category === slug).slice(0, 3)
  ).slice(0, 20);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-bg overflow-hidden">
        <div className="container grid items-center gap-6 py-8 sm:py-12 lg:py-16 lg:min-h-[600px] lg:gap-12 lg:grid-cols-2">
          {/* Left */}
          <div className="space-y-5 sm:space-y-7 max-w-2xl">
            <p className="aura-kicker">Wellness для вашого дому</p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.06] text-foreground">
              Комфорт.<br />Відновлення.<br />Якість життя.
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed text-muted-foreground max-w-lg">
              Ортопедичні товари, масажери та wellness-девайси для щоденного догляду за собою — з доставкою по всій Україні.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button asChild size="lg" className="h-11 sm:h-12 rounded-full btn-aura border-0 font-light px-6 sm:px-8">
                <Link to="/catalog">Переглянути колекцію <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 sm:h-12 rounded-full font-light px-6 sm:px-8 border-border/60 bg-white/60 hover:bg-white text-foreground">
                <a href="#featured">Популярні товари</a>
              </Button>
            </div>
          </div>

          {/* Right — показується на sm+ */}
          <div className="relative hidden sm:block">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-primary/8 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-white shadow-elevated">
              <img
                src={HERO_IMG}
                alt="Wellness lifestyle"
                className="aspect-[4/3] w-full object-cover object-center"
                loading="eager"
                onError={e => { e.currentTarget.style.display = "none"; }}
              />
              <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-light text-foreground">Перевірені wellness-товари</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">для спини, сну, постави та відновлення</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile — мала смужка з зображенням знизу тексту */}
        <div className="sm:hidden w-full overflow-hidden" style={{height: "200px"}}>
          <img
            src={HERO_IMG}
            alt="Wellness"
            className="w-full h-full object-cover object-top"
            loading="eager"
            onError={e => { e.currentTarget.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-y border-border/60 bg-white/50">
        <div className="container py-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
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
      <section className="container py-12 sm:py-20">
        <div className="mb-6 sm:mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="aura-kicker mb-3">каталог</p>
            <h2 className="text-4xl md:text-5xl font-light">Категорії товарів</h2>
            <p className="mt-2 text-muted-foreground font-light">Оберіть потрібний напрямок</p>
          </div>
          <Link to="/catalog" className="hidden items-center gap-2 text-sm text-primary font-light transition-smooth hover:gap-3 sm:flex">
            Усі товари <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7">
          {categories.map(c => <CategoryCard key={c.id} category={c} />)}
        </div>
      </section>

      {/* ── FEATURED CAROUSEL ── */}
      <FeaturedCarousel products={featured} />

      {/* ── ПІДБІР ЗА ЗАДАЧЕЮ ── */}
      <section className="container py-12 sm:py-20">
        <div className="mb-8 sm:mb-12 text-center">
          <p className="aura-kicker mb-3">підбір</p>
          <h2 className="text-4xl md:text-5xl font-light">Що вас турбує?</h2>
          <p className="mt-3 text-muted-foreground font-light">Оберіть запит — підберемо відповідні товари</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {needs.map((n, i) => (
            <Link key={i} to={n.link}
              className={`${n.color} rounded-2xl p-4 sm:p-6 flex flex-col items-center gap-3 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95`}>
              <span className="text-3xl sm:text-4xl">{n.icon}</span>
              <span className="text-xs sm:text-sm font-medium text-foreground leading-snug">{n.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── БЛОГ / СТАТТІ ── */}
      <section className="bg-secondary/40 py-12 sm:py-20">
        <div className="container">
          <div className="mb-8 sm:mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="aura-kicker mb-3">корисно знати</p>
              <h2 className="text-4xl md:text-5xl font-light">Здоров'я починається вдома</h2>
              <p className="mt-2 text-muted-foreground font-light">Поради щодо догляду за тілом і відновлення</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((a, i) => (
              <Link key={i} to={a.link}
                className={`group flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${a.bg} border border-white/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-card`}>
                <div className="flex items-center justify-center py-8 sm:py-10">
                  <span className="text-5xl sm:text-6xl">{a.emoji}</span>
                </div>
                <div className="flex flex-col flex-1 bg-white/70 p-5 sm:p-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: a.accent }}>{a.tag}</span>
                  <h3 className="text-base sm:text-lg font-light leading-snug text-foreground mb-3">{a.title}</h3>
                  <p className="text-xs sm:text-sm font-light leading-relaxed text-muted-foreground flex-1">{a.text}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium transition-all duration-200 group-hover:gap-2" style={{ color: a.accent }}>
                    Дізнатись більше <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="container py-12 sm:py-20">
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
      <section className="bg-secondary/40 py-12 sm:py-20">
        <div className="container">
          <div className="mb-8 sm:mb-12 text-center">
            <p className="aura-kicker mb-3">відгуки</p>
            <h2 className="text-4xl md:text-5xl font-light">Клієнти про нас</h2>
          </div>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
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

      {/* ── INSTAGRAM CTA ── */}
      <section className="container py-12 sm:py-16">
        <div className="rounded-3xl bg-gradient-to-br from-[#F5EFE6] via-[#EDE3D5] to-[#E8EDF5] border border-white/60 p-8 sm:p-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-3xl bg-white/80 shadow-soft">
            <Instagram className="h-8 w-8 sm:h-10 sm:w-10 text-primary" strokeWidth={1.4} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-light text-foreground">Ми в Instagram</h3>
            <p className="mt-2 text-sm sm:text-base font-light text-muted-foreground">Поради з догляду за тілом, огляди товарів та wellness-лайфхаки щодня</p>
          </div>
          <Button asChild size="lg" className="h-12 rounded-full btn-aura border-0 font-light px-8 shrink-0 w-full sm:w-auto">
            <a href="https://instagram.com/aurahomeua" target="_blank" rel="noopener noreferrer">
              Підписатись <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* ── DELIVERY + PAYMENT ── */}
      <section className="container py-10 sm:py-16 grid md:grid-cols-2 gap-4 sm:gap-5">
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
