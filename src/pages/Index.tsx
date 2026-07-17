import { Link } from "react-router-dom";
import { useRef, useState, useMemo } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, ShieldCheck, CreditCard, Headphones, Star, RotateCcw, Flame, Sparkles, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { useProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";
import { ReviewsSection } from "@/components/ReviewsSection";
import { useSEO } from "@/hooks/useSEO";
import { OptimizedImage } from "@/components/OptimizedImage";
import { formatUAH } from "@/data/products";

const HERO_PRODUCTS = [
  {
    src: "https://images.prom.ua/6735125980_ortopedicheskaya-podushka-dlya.jpg",
    alt: "Ортопедична подушка з ефектом пам'яті",
    badge: "Хіт продажів",
  },
  {
    src: "https://images.prom.ua/6988727235_massazhnyj-kovrik-ortek.jpg",
    alt: "Масажний килимок Ортек",
  },
  {
    src: "https://images.prom.ua/6735201816_svetodiodnaya-led-maska-dlya.jpg",
    alt: "LED маска для обличчя",
  },
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


const ProductCarousel = ({ products }: { products: any[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("article");
    const w = card ? card.offsetWidth + 12 : 200;
    scrollRef.current.scrollBy({ left: dir === "right" ? w * 2 : -w * 2, behavior: "smooth" });
  };
  if (products.length === 0) return (
    <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
      Товари завантажуються...
    </div>
  );
  return (
    <div className="relative">
      {/* Desktop scroll buttons */}
      <button onClick={() => scroll("left")} aria-label="Прокрутити ліворуч"
        className="hidden sm:flex absolute left-0 sm:left-2 top-1/2 -translate-y-8 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <button onClick={() => scroll("right")} aria-label="Прокрутити праворуч"
        className="hidden sm:flex absolute right-0 sm:right-2 top-1/2 -translate-y-8 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
      {/* Mobile: full-bleed snap scroll; Desktop: padded */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 sm:mx-10 px-4 sm:px-0"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {products.map(p => (
          <div
            key={p.id}
            className="shrink-0"
            style={{
              width: "calc(50% - 8px)",
              minWidth: "152px",
              maxWidth: "220px",
              scrollSnapAlign: "start",
            }}
          >
            <ProductCard product={p} compact />
          </div>
        ))}
        {/* Trailing spacer for mobile edge padding */}
        <div className="sm:hidden shrink-0 w-1" aria-hidden="true" />
      </div>
    </div>
  );
};

const Index = () => {
  useSEO({
    title: "Масажери та товари для краси, здоров'я і комфорту",
    description: "BodyHome — масажери для обличчя та тіла, ортопедичні подушки, устілки, бандажі. Товари для щоденного догляду та здоров'я. Доставка по Україні.",
    keywords: "масажери для обличчя, товари для краси, ортопедичні подушки, устілки, бандажі, товари для здоров'я, Україна",
    url: "/",
    type: "website",
  });
  const [activeTab, setActiveTab] = useState<"hits" | "new" | "sale">("hits");
  const { products } = useProductsAsLegacy();
  const { categories: allCats } = useCategoriesAsLegacy();
  const categories = allCats.filter(c => !c.parentId);

  const baseProducts = products.filter(p => !p.parentProductId && !p.isParent);

  const beautyProducts = useMemo(() =>
    products
      .filter(p => p.category === "krasota-i-doglyad" && !p.parentProductId)
      .sort((a, b) => b.price - a.price)
      .slice(0, 4),
    [products]
  );

  const hits = baseProducts
    .filter(p => p.reviews >= 3)
    .sort((a, b) => b.reviews - a.reviews || b.rating - a.rating)
    .slice(0, 16);

  const novelties = baseProducts
    .filter(p => p.badge === "Новинка")
    .slice(0, 16);

  const sales = baseProducts
    .filter(p => p.originalPrice && p.originalPrice > p.price)
    .sort((a, b) => (b.originalPrice! / b.price) - (a.originalPrice! / a.price))
    .slice(0, 16);

  const tabProducts = activeTab === "hits" ? hits : activeTab === "new" ? novelties : sales;

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[68svh] sm:min-h-[460px] lg:min-h-[520px] bg-gradient-to-br from-emerald-50 via-white to-green-50/70">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-28 -right-28 h-80 w-80 rounded-full bg-primary/8" />
          <div className="absolute bottom-0 right-1/4 h-56 w-56 translate-y-1/3 rounded-full bg-primary/5" />
          <div className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-primary/6" />
        </div>

        {/* ── DESKTOP ── */}
        <div className="hidden sm:flex absolute inset-0 items-center">
          <div className="container flex items-center gap-10 lg:gap-14">

            {/* left — text card */}
            <div className="w-[44%] lg:w-[40%] shrink-0">
              <div className="rounded-3xl bg-white p-8 lg:p-12 shadow-2xl border border-white/80">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/15 px-3 py-1.5 mb-5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium">Краса та здоров'я вдома</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-[1.1] mb-4">
                  Краса та здоров'я — починаються вдома
                </h1>
                <p className="text-base font-light text-foreground/65 leading-relaxed mb-7 max-w-sm">
                  Масажери для обличчя і тіла, ортопедичні подушки, устілки — для щоденного догляду та комфорту. Доставка Новою Поштою.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="h-12 rounded-xl btn-aura border-0 font-medium px-8">
                    <Link to="/catalog">Переглянути каталог <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-12 rounded-xl font-light px-6 border-border/50 hover:bg-secondary">
                    <a href="#featured">Популярні товари</a>
                  </Button>
                </div>
              </div>
            </div>

            {/* right — product showcase */}
            <div className="flex-1 flex items-center justify-center gap-5 py-10">
              {/* main product */}
              <div className="relative">
                <div className="w-56 h-56 lg:w-[17rem] lg:h-[17rem] bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center p-5">
                  <OptimizedImage
                    src={HERO_PRODUCTS[0].src}
                    alt={HERO_PRODUCTS[0].alt}
                    className="w-full h-full object-contain"
                    loading="eager"
                    sizes="272px"
                  />
                </div>
                <span className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
                  {HERO_PRODUCTS[0].badge}
                </span>
              </div>

              {/* secondary products stacked */}
              <div className="hidden lg:flex flex-col gap-4">
                <div className="w-[7.5rem] h-[7.5rem] bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center p-3 rotate-2 hover:rotate-0 transition-transform">
                  <OptimizedImage
                    src={HERO_PRODUCTS[1].src}
                    alt={HERO_PRODUCTS[1].alt}
                    className="w-full h-full object-contain"
                    sizes="120px"
                  />
                </div>
                <div className="w-[7.5rem] h-[7.5rem] bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center p-3 -rotate-1 hover:rotate-0 transition-transform">
                  <OptimizedImage
                    src={HERO_PRODUCTS[2].src}
                    alt={HERO_PRODUCTS[2].alt}
                    className="w-full h-full object-contain"
                    sizes="120px"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="sm:hidden absolute inset-0 flex flex-col">
          {/* product image top-right */}
          <div className="flex justify-end px-5 pt-6">
            <div className="relative">
              <div className="w-36 h-36 bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center p-3">
                <OptimizedImage
                  src={HERO_PRODUCTS[0].src}
                  alt={HERO_PRODUCTS[0].alt}
                  className="w-full h-full object-contain"
                  loading="eager"
                  sizes="144px"
                />
              </div>
              <span className="absolute -top-2 -left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">Хіт</span>
            </div>
          </div>

          {/* spacer */}
          <div className="flex-1" />

          {/* white card at bottom */}
          <div className="bg-white rounded-t-3xl px-5 pt-6 pb-8 shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 border border-primary/15 px-3 py-1 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-primary font-medium">Краса та здоров'я вдома</span>
            </div>
            <h1 className="text-[1.65rem] font-extrabold text-foreground leading-[1.15] mb-3">
              Краса та здоров'я — починаються вдома
            </h1>
            <p className="text-sm font-light text-foreground/65 leading-relaxed mb-5">
              Масажери для обличчя і тіла, ортопедичні подушки, устілки — для щоденного догляду та комфорту.
            </p>
            <div className="flex flex-col gap-2.5">
              <Button asChild size="lg" className="h-12 w-full rounded-xl btn-aura border-0 font-medium">
                <Link to="/catalog">Переглянути каталог <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-xl font-light border-border/50 hover:bg-secondary">
                <a href="#featured">Популярні товари</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-b border-border/50 bg-white">
        <div className="container py-4 sm:py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3">
            {trust.map((t, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8">
                  <t.icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground leading-tight">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="container py-8 sm:py-20">
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
        {/* Mobile: snap scroll; Desktop: grid */}
        <div
          className="sm:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"
          style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {categories.map(c => (
            <div key={c.id} className="shrink-0" style={{ width: "calc(33vw - 16px)", minWidth: "96px", maxWidth: "140px", scrollSnapAlign: "start" }}>
              <CategoryCard category={c} />
            </div>
          ))}
          <div className="shrink-0 w-1" />
        </div>
        <div className="hidden sm:grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7">
          {categories.map(c => <CategoryCard key={c.id} category={c} />)}
        </div>
      </section>
      {/* ── ЩО ХОЧЕТЕ ПОКРАЩИТИ — Variant B: Mini Tiles ── */}
      <section className="py-10 sm:py-16 bg-[#F8F6F2]">
        <div className="container">
          <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="block h-px w-6 bg-primary" />
                <p className="aura-kicker">підбір</p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-medium">Що хочете покращити?</h2>
            </div>
            <Link to="/catalog" className="hidden sm:flex items-center gap-1 text-sm text-primary font-light hover:gap-2 transition-all">
              Усі категорії <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
            {([
              { emoji: "🦴", label: "Спина і поперек",   desc: "Болі, постава, бандажі",        link: "/catalog?category=ortezy-i-bandazhi",             bg: "#EAF2E8", anim: "tile-anim-wiggle" },
              { emoji: "🌙", label: "Сон і шия",          desc: "Ортопедичні подушки",           link: "/catalog?category=ortopedychni-podushky",         bg: "#E8EDF5", anim: "tile-anim-float" },
              { emoji: "👣", label: "Стопи і коліна",     desc: "Устілки, плоскостопість",       link: "/catalog?category=ortopedychni-ustilky",          bg: "#EAF0F0", anim: "tile-anim-pulse" },
              { emoji: "💆", label: "Масаж і релакс",     desc: "Зняти напругу вдома",           link: "/catalog?category=masazhery",                     bg: "#F5EFE6", anim: "tile-anim-heartbeat" },
              { emoji: "🌊", label: "Масажні килимки",    desc: "Рефлексотерапія для ніг",       link: "/catalog?category=ortopedychni-masazhni-kylymky", bg: "#F0EAF5", anim: "tile-anim-sway" },
              { emoji: "✨", label: "Краса і догляд",     desc: "Домашні SPA-процедури",         link: "/catalog?category=tovary-dlia-krasy",             bg: "#F5F0E0", anim: "tile-anim-float2" },
              { emoji: "🧸", label: "Для дітей",          desc: "Розвиток і здоров'я малюка",    link: "/catalog?category=rozvyvaiuchi-ihrashky",         bg: "#F5E8F0", anim: "tile-anim-bounce" },
            ] as { emoji: string; label: string; desc: string; link: string; bg: string; anim: string }[]).map(({ emoji, label, desc, link, bg, anim }) => (
              <Link
                key={label}
                to={link}
                className="need-tile group flex flex-col items-center gap-1.5 rounded-2xl p-3 sm:p-4 border border-transparent hover:border-border/60 hover:bg-white hover:-translate-y-1 hover:shadow-card transition-all duration-200 active:scale-95"
              >
                <div
                  className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl text-2xl sm:text-3xl shrink-0 transition-all duration-200 group-hover:scale-105 mb-0.5"
                  style={{ background: bg }}
                >
                  <span className={`need-tile-icon ${anim}`}>{emoji}</span>
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-foreground/80 text-center leading-tight group-hover:text-primary transition-colors">
                  {label}
                </span>
                <span className="hidden sm:block text-[10px] text-foreground/45 text-center leading-tight group-hover:text-primary/60 transition-colors">
                  {desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ХІТИ / НОВИНКИ / РОЗПРОДАЖ ── */}
      <section id="featured" className="bg-secondary/40 pt-8 pb-12 sm:pt-10 sm:pb-20">
        <div className="container mb-6">
          <div className="flex items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("hits")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "hits"
                    ? "bg-primary text-white"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}>
                <Flame className="h-3.5 w-3.5" />
                Хіти
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "new"
                    ? "bg-primary text-white"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}>
                <Sparkles className="h-3.5 w-3.5" />
                Новинки
              </button>
              <button
                onClick={() => setActiveTab("sale")}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "sale"
                    ? "bg-primary text-white"
                    : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}>
                <Tag className="h-3.5 w-3.5" />
                Розпродаж
              </button>
            </div>

            {/* Весь каталог */}
            <Link to="/catalog" className="flex items-center gap-2 text-sm text-primary font-light transition-smooth hover:gap-3 shrink-0">
              Весь каталог <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <ProductCarousel products={tabProducts} />
      </section>

      {/* ── BEAUTY & CARE ── */}
      {beautyProducts.length > 0 && (
        <section className="py-12 sm:py-16" style={{ background: "linear-gradient(135deg, #131a17 0%, #1c2820 60%, #1a1f1d 100%)" }}>
          <div className="container">
            {/* Header */}
            <div className="mb-8 sm:mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] font-medium mb-3" style={{ color: "#c9a96e" }}>
                  Домашній догляд
                </p>
                <h2 className="text-3xl sm:text-4xl font-medium text-white">Салонний ефект — вдома</h2>
                <p className="mt-2 text-sm font-light" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Апарати для догляду за обличчям та тілом
                </p>
              </div>
              <Link
                to="/catalog?category=krasota-i-doglyad"
                className="hidden sm:flex items-center gap-2 text-sm font-light shrink-0 transition-colors hover:opacity-80"
                style={{ color: "#c9a96e" }}
              >
                Всі товари краси <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {beautyProducts.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug ?? p.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(201,169,110,0.35)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  {/* Hit badge */}
                  {i < 2 && (
                    <span
                      className="absolute left-2.5 top-2.5 z-10 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                      style={{ background: "#c9a96e", color: "#131a17" }}
                    >
                      ✨ Хіт продажів
                    </span>
                  )}
                  {/* Image */}
                  <div className="aspect-square grid place-items-center p-4" style={{ background: "rgba(255,255,255,0.06)" }}>
                    {p.images?.[0] ? (
                      <OptimizedImage
                        src={p.images[0]}
                        alt={p.name}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 45vw, 25vw"
                        quality={80}
                      />
                    ) : (
                      <div className="h-full w-full rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }} />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex flex-col flex-1 gap-2 p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-2 transition-colors" style={{ color: "rgba(255,255,255,0.85)" }}>
                      {p.name}
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                      <span className="text-base sm:text-lg font-bold" style={{ color: "#c9a96e" }}>
                        {formatUAH(p.price)}
                      </span>
                      <span
                        className="text-[10px] sm:text-xs rounded-full px-2 sm:px-3 py-1 transition-all duration-200 whitespace-nowrap"
                        style={{ border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.55)" }}
                      >
                        Переглянути →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile link */}
            <div className="mt-6 flex justify-center sm:hidden">
              <Link
                to="/catalog?category=krasota-i-doglyad"
                className="inline-flex items-center gap-2 text-sm font-light"
                style={{ color: "#c9a96e" }}
              >
                Всі товари краси <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── БЛОГ / СТАТТІ ── */}
      <section className="bg-secondary/40 py-12 sm:py-20">
        <div className="container">
          <div className="mb-8 sm:mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="aura-kicker mb-3">корисно знати</p>
              <h2 className="text-4xl md:text-5xl font-light">Краса і здоров'я починаються вдома</h2>
              <p className="mt-2 text-muted-foreground font-light">Поради щодо догляду за тілом, красою та відновленням</p>
            </div>
            <Link to="/blog" className="hidden sm:flex items-center gap-2 text-sm text-primary font-light transition-smooth hover:gap-3 shrink-0">
              Всі статті <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Mobile: horizontal snap scroll; Desktop: grid */}
          <div
            className="sm:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4"
            style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          >
            {articles.map((a, i) => (
              <Link key={i} to={a.link}
                className={`group shrink-0 flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${a.bg} border border-white/60 transition-all duration-300 active:scale-[0.98]`}
                style={{ width: "72vw", maxWidth: "280px", scrollSnapAlign: "start" }}>
                <div className="flex items-center justify-center py-7">
                  <span className="text-5xl">{a.emoji}</span>
                </div>
                <div className="flex flex-col flex-1 bg-white/70 p-4">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-medium mb-1.5" style={{ color: a.accent }}>{a.tag}</span>
                  <h3 className="text-sm font-medium leading-snug text-foreground mb-2 line-clamp-2">{a.title}</h3>
                  <div className="mt-auto flex items-center gap-1 text-xs font-medium" style={{ color: a.accent }}>
                    Читати <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            ))}
            <div className="shrink-0 w-1" />
          </div>
          <div className="hidden sm:grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          <h2 className="text-xl font-light mb-4">Доставка</h2>
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
          <h2 className="text-xl font-light mb-4">Оплата</h2>
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
