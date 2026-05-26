import { Link } from "react-router-dom";
import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, CreditCard, Headphones, Star, RotateCcw, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { useProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";
import { ReviewsSection } from "@/components/ReviewsSection";
import { useSEO } from "@/hooks/useSEO";

// Жінка з масажером вдома — домашній комфорт
const HERO_IMG = "https://images.pexels.com/photos/6787202/pexels-photo-6787202.jpeg?auto=compress&cs=tinysrgb&w=1400&fit=crop";



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
    link: "/blog/chomu-bolyt-spyna-i-yak-dopomahaie-ortopediia",
    emoji: "🦴",
    bg: "from-[#F5EFE6] to-[#EDE3D5]",
    accent: "#8A6440",
  },
  {
    tag: "Відновлення",
    title: "Масаж вдома: як відновитись після важкого дня",
    text: "Регулярний самомасаж покращує кровообіг, знімає м'язову напругу і допомагає тілу відновитись. Масажні мати та ролики — прості інструменти для щоденного догляду.",
    link: "/blog/masazh-vdoma-yak-vidnovytysia-pislia-vazhkoho-dnia",
    emoji: "💆",
    bg: "from-[#EAF2E8] to-[#D8EAD5]",
    accent: "#3D7A55",
  },
  {
    tag: "Якість сну",
    title: "Як правильна подушка впливає на якість сну",
    text: "Під час сну хребет має зберігати природне положення. Ортопедична подушка підтримує шийний відділ і запобігає ранковому болю. Правильний вибір — інвестиція в здоров'я.",
    link: "/blog/yak-pravylna-podushka-vplyvaie-na-yakist-snu",
    emoji: "🌙",
    bg: "from-[#E8EDF5] to-[#D5DEEA]",
    accent: "#3D5A8A",
  },
  {
    tag: "Дитяча ортопедія",
    title: "Ортопедія для дітей: коли починати та що обирати",
    text: "Дитячий хребет і стопи формуються до 12 років. Правильні устілки, ортопедичні подушки та розвиваючі масажні килимки допомагають запобігти плоскостопості та порушенням постави.",
    link: "/blog/ortopediia-dlia-ditei-koly-pochynaty-ta-shcho-obuyraty",
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
  useSEO({
    title: "Ортопедичні товари, масажери та товари для здоров'я",
    description: "BodyHome — інтернет-магазин товарів для здоров'я. Ортопедичні подушки, устілки, бандажі, масажери, аплікатори. Доставка по Україні. Оплата при отриманні.",
    keywords: "ортопедичні подушки, масажери, устілки, бандажі, товари для здоров'я, ортопедія Україна",
    url: "/",
    type: "website",
  });
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
      <section className="hero-bg relative overflow-hidden min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Photo — права половина */}
        <div className="absolute inset-y-0 right-0 w-full sm:w-[62%] lg:w-[55%]">
          <img
            src={HERO_IMG}
            alt="Масажний килимок для здоров'я стоп вдома"
            className="h-full w-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-[#F5F0EA] via-[#F5F0EA]/85 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F5F0EA]/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container py-12 sm:py-16 lg:py-20">
          <div className="max-w-[520px] space-y-4 sm:space-y-6">

            {/* Kicker */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">
                Доставка по всій Україні
              </span>
            </div>

            {/* H1 — чіткий і зрозумілий */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-foreground">
              Корисні товари для здоров'я та комфорту вдома
            </h1>

            {/* Підзаголовок — пояснює що продаємо */}
            <p className="text-base sm:text-lg font-light leading-relaxed text-foreground/70 max-w-md">
              Масажери, ортопедичні подушки, устілки та бандажі — все для щоденного комфорту. Без переплат, з доставкою Новою Поштою.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button asChild size="lg" className="h-12 w-full sm:w-auto rounded-full btn-aura border-0 font-medium px-8">
                <Link to="/catalog">Переглянути каталог <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 w-full sm:w-auto rounded-full font-light px-8 border-border/60 bg-white/70 hover:bg-white text-foreground">
                <a href="#featured">Популярні товари</a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { icon: "✓", text: "Нова Пошта" },
                { icon: "✓", text: "Оплата при отриманні" },
                { icon: "✓", text: "14 днів повернення" },
                { icon: "✓", text: "Перевірка перед оплатою" },
              ].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-border/40 shadow-sm px-3 py-1 text-xs text-foreground/75 font-medium">
                  <span className="text-primary text-[10px] font-bold">{t.icon}</span>
                  {t.text}
                </span>
              ))}
            </div>
          </div>
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
            <Link to="/blog" className="hidden sm:flex items-center gap-2 text-sm text-primary font-light transition-smooth hover:gap-3 shrink-0">
              Всі статті <ArrowRight className="h-4 w-4" />
            </Link>
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
          <div className="mt-6 flex justify-center sm:hidden">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary font-light">
              Всі статті <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection />

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
