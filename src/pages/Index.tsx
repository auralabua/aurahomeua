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

// Жінка з масажером вдома — домашній комфорт
const HERO_IMG = "https://images.pexels.com/photos/5927933/pexels-photo-5927933.jpeg?auto=compress&cs=tinysrgb&w=1400";



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
    const w = card ? card.offsetWidth + 16 : 240;
    scrollRef.current.scrollBy({ left: dir === "right" ? w * 2 : -w * 2, behavior: "smooth" });
  };
  if (products.length === 0) return (
    <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
      Товари завантажуються...
    </div>
  );
  return (
    <div className="relative px-4 sm:px-6 lg:px-8">
      <button onClick={() => scroll("left")} aria-label="Прокрутити ліворуч"
        className="absolute left-0 sm:left-1 top-1/2 -translate-y-8 z-10 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white shadow-md border border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>
      <button onClick={() => scroll("right")} aria-label="Прокрутити праворуч"
        className="absolute right-0 sm:right-1 top-1/2 -translate-y-8 z-10 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white shadow-md border border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200">
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
      </button>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-3 mx-6 sm:mx-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {products.map(p => (
          <div key={p.id} className="shrink-0 w-[calc(25%-10px)] min-w-[160px] max-w-[240px]">
            <ProductCard product={p} compact />
          </div>
        ))}
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

  // Map sub-category → parent slug
  const parentOf = useMemo(() => {
    const m: Record<string, string> = {};
    allCats.forEach(c => { if (c.parentId) m[c.id as string] = c.parentId as string; });
    return m;
  }, [allCats]);

  // First available image per category (including from sub-categories)
  const categoryImages = useMemo(() => {
    const map: Record<string, string> = {};
    products.forEach(p => {
      const img = p.images?.[0];
      if (!img) return;
      const cat = p.category as string;
      if (!map[cat]) map[cat] = img;
      const parent = parentOf[cat];
      if (parent && !map[parent]) map[parent] = img;
    });
    return map;
  }, [products, parentOf]);

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
      <section className="hero-bg relative overflow-hidden min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Photo */}
        <div className="absolute inset-y-0 right-0 w-full sm:w-[62%] lg:w-[55%]">
          <OptimizedImage
            src={HERO_IMG}
            alt="Масажери та товари для краси і здоров'я вдома — BodyHome"
            className="h-full w-full object-cover object-top"
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 62vw, 55vw"
            quality={85}
          />
          {/* Desktop: beige gradient so dark text sits on light background */}
          <div className="hidden sm:block absolute inset-y-0 left-0 w-3/4 bg-gradient-to-r from-[#F5F0EA] via-[#F5F0EA]/85 to-transparent" />
          {/* Mobile: dark overlay so white text is readable over the photo */}
          <div className="sm:hidden absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.0) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F5F0EA]/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container py-12 sm:py-16 lg:py-20">
          <div className="max-w-[520px] space-y-4 sm:space-y-5">

            {/* Kicker */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/25 sm:bg-primary/10 border border-white/40 sm:border-primary/20 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white sm:bg-primary animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-white sm:text-primary font-medium">
                Краса та здоров'я вдома
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-white sm:text-foreground [text-shadow:0_1px_4px_rgba(0,0,0,0.45)] sm:[text-shadow:none]">
              Краса та здоров'я — починаються вдома
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg font-light leading-relaxed text-white/90 sm:text-foreground/70 max-w-md">
              Масажери для обличчя і тіла, ортопедичні подушки, устілки — для щоденного догляду та комфорту. Доставка Новою Поштою.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button asChild size="lg" className="h-12 w-full sm:w-auto rounded-full btn-aura border-0 font-medium px-8">
                <Link to="/catalog">Переглянути каталог <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 w-full sm:w-auto rounded-full font-light px-8 border-white/50 sm:border-border/60 bg-white/15 sm:bg-white/70 hover:bg-white/25 sm:hover:bg-white text-white sm:text-foreground">
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
          {categories.map(c => <CategoryCard key={c.id} category={c} imageUrl={categoryImages[c.id]} />)}
        </div>
      </section>
      {/* ── ЩО ХОЧЕТЕ ПОКРАЩИТИ ── */}
      <section className="py-12 sm:py-16 bg-[#F8F6F2]">
        <div className="container">
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="block h-px w-6 bg-[#3D7A55]" />
              <p className="aura-kicker">підбір</p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-medium">Що хочете покращити?</h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground font-light">
              Оберіть свій запит — підберемо відповідні товари
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              {
                Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 2C9.5 2 7 4.5 7 7v10c0 2.5 2.5 5 5 5s5-2.5 5-5V7c0-2.5-2.5-5-5-5z"/><path d="M9 10h6M9 14h6"/></svg>,
                title: "Для спини",
                desc: "Подушки, масажери, бандажі",
                badge: "ХІТ",
                count: "86 товарів",
                link: "/catalog?category=ortopedychni-podushky",
                accentColor: "#3D7A55",
                iconBg: "#3D7A55",
                iconColor: "#ffffff",
                badgeColor: "#3D7A55",
              },
              {
                Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M3 12h18M3 6h18M3 18h18"/><rect x="6" y="3" width="12" height="18" rx="2"/></svg>,
                title: "Для сну",
                desc: "Ортопедичні подушки",
                badge: "ТОП",
                count: "78 товарів",
                link: "/catalog?category=ortopedychni-podushky",
                accentColor: "#3D5A8A",
                iconBg: "#3D5A8A",
                iconColor: "#ffffff",
                badgeColor: "#3D5A8A",
              },
              {
                Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
                title: "Для офісу",
                desc: "Комфорт при сидячій роботі",
                badge: null,
                count: "54 товари",
                link: "/catalog?category=ortezy-i-bandazhi",
                accentColor: "#2A7070",
                iconBg: "#2A7070",
                iconColor: "#ffffff",
                badgeColor: null,
              },
              {
                Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/><path d="M12 12v10M8 18l4 4 4-4"/><path d="M6 14c-2 1-3 3-2 5M18 14c2 1 3 3 2 5"/></svg>,
                title: "Для відновлення",
                desc: "Масажери та прилади",
                badge: "ТОП",
                count: "43 товари",
                link: "/catalog?category=masazhery",
                accentColor: "#8A4040",
                iconBg: "#8A4040",
                iconColor: "#ffffff",
                badgeColor: "#8A4040",
              },
              {
                Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M12 22V12M12 12C10 8 6 7 4 9M12 12C14 8 18 7 20 9"/><path d="M4 4h16"/><circle cx="12" cy="4" r="1" fill="currentColor"/></svg>,
                title: "Зняти напругу",
                desc: "Аплікатори, килимки",
                badge: null,
                count: "91 товар",
                link: "/catalog?category=ortopedychni-masazhni-kylymky",
                accentColor: "#3D7A55",
                iconBg: "#EAF2E8",
                iconColor: "#3D7A55",
                badgeColor: null,
              },
              {
                Icon: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                title: "Комфорт вдома",
                desc: "Девайси та устілки",
                badge: null,
                count: "67 товарів",
                link: "/catalog?category=tovary-dlia-krasy",
                accentColor: "#7A6A20",
                iconBg: "#7A6A20",
                iconColor: "#ffffff",
                badgeColor: null,
              },
            ].map((item, i) => (
              <Link key={i} to={item.link}
                className="group relative flex flex-col gap-3 rounded-2xl border border-border/40 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] active:scale-[0.98]"
                style={{ borderLeftColor: item.accentColor, borderLeftWidth: "4px" }}>

                {/* Top row: icon + badge */}
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: item.iconBg, color: item.iconColor }}>
                    <item.Icon />
                  </div>
                  {item.badge && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide"
                      style={{ backgroundColor: item.badgeColor! }}>
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm sm:text-base">{item.title}</p>
                  <p className="hidden sm:block text-xs text-muted-foreground mt-0.5 font-light">{item.desc}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <span className="text-xs text-muted-foreground font-medium">{item.count}</span>
                  <span className="text-xs font-semibold text-primary flex items-center gap-0.5 group-hover:gap-1.5 transition-all duration-200">
                    Переглянути <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
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
