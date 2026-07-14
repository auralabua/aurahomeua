import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Phone, Sparkles, ChevronDown, ArrowRight, BookOpen, Bone, Waves, Baby, Activity, Heart, Zap, BedDouble, Monitor, RotateCcw, Footprints, Star, Info, MapPin } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCategoriesAsLegacy } from "@/hooks/useShopData";
import { Button } from "@/components/ui/button";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const handler = useCallback(() => {
    const y = window.scrollY;
    if (y < 60) { setHidden(false); lastY.current = y; return; }
    setHidden(y > lastY.current);
    lastY.current = y;
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [handler]);
  return hidden;
}

const PHONE = "+380956981124";
const TELEGRAM = "https://t.me/BodyHome1";
const VIBER = "viber://chat?number=%2B380956981124";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  "ortopedychni-podushky": BedDouble,
  "ortopedychni-ustilky": Footprints,
  "ortezy-i-bandazhi": Activity,
  "masazhery": Zap,
  "tovary-dlia-krasy": Sparkles,
  "rozvyvaiuchi-ihrashky": Baby,
  "tovary-dlia-domu": Monitor,
  "reabilitatsiya": RotateCcw,
};

const PROBLEM_ITEMS = [
  { Icon: Bone, label: "Спина і поперек", url: "/catalog?category=ortezy-i-bandazhi" },
  { Icon: BedDouble, label: "Сон і шия", url: "/catalog?category=ortopedychni-podushky" },
  { Icon: Footprints, label: "Стопи і коліна", url: "/catalog?category=ortopedychni-ustilky" },
  { Icon: Zap, label: "Масаж і релакс", url: "/catalog?category=masazhery" },
  { Icon: Waves, label: "Масажні килимки", url: "/catalog?category=ortopedychni-masazhni-kylymky" },
  { Icon: Sparkles, label: "Краса і догляд", url: "/catalog?category=tovary-dlia-krasy" },
  { Icon: Baby, label: "Для дітей", url: "/catalog?category=rozvyvaiuchi-ihrashky" },
];

const blogItems = [
  { icon: Activity, label: "Остеохондроз шиї: симптоми і домашнє лікування", link: "/blog/osteokhondroz-shyiny-symptomy-i-domashnye-likuvannia", tag: "Здоров'я спини" },
  { icon: Bone, label: "Як обрати ортез на гомілковостопний суглоб", link: "/blog/yak-obraty-ortez-na-homilkovostopnyi-suhlyb", tag: "Ортези і бандажі" },
  { icon: Baby, label: "Дитяча постура: як сформувати правильну з дитинства", link: "/blog/dytiacha-postura-yak-sformuvaty-pravilnu-z-dytynstva", tag: "Дитяча ортопедія" },
  { icon: Heart, label: "Після пологів: відновлення тіла — що допоможе", link: "/blog/pislia-rodiv-vidnovlennia-tila-shcho-dopomazhe", tag: "Відновлення" },
  { icon: Waves, label: "Масаж стоп: чому це важливо і як робити вдома", link: "/blog/masazh-stop-chomu-tse-vazhlyvo-i-yak-robyty-vdoma", tag: "Здоров'я ніг" },
];

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z"/></svg>
);
const ViberIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M11.4 0C6.37.03 2.33 2.4.64 6.37c-.97 2.3-1.03 4.74-.97 7.18.06 2.44.13 4.88 1.36 7.07 1.23 2.2 3.34 3.8 5.7 4.5.3.09.62.12.94.07l-.01-4.97c-.3-.1-.58-.24-.84-.42a5.3 5.3 0 01-2.02-3.73c-.1-2.52.26-5.18 1.84-7.22C8.27 6.5 10.73 5.7 13.1 5.7c2.37 0 4.72.97 6.2 2.8 1.48 1.85 1.8 4.38 1.72 6.7-.08 2.3-.48 4.73-1.97 6.54-1.5 1.8-3.9 2.7-6.2 2.57-.6-.03-1.18-.15-1.74-.33l-.01 4.97c.55.12 1.1.14 1.65.1 3.28-.22 6.36-1.84 8.3-4.43 1.94-2.6 2.46-5.9 2.46-9.08 0-3.18-.52-6.48-2.46-9.08C18.98 1.9 15.26.22 11.4 0z"/></svg>
);


export const Navbar = () => {
  const { totalCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { categories } = useCategoriesAsLegacy();
  const navigate = useNavigate();
  const location = useLocation();
  const navHidden = useHideOnScroll();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const blogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (blogRef.current && !blogRef.current.contains(e.target as Node)) setBlogOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMenu = useCallback(() => {
    setMobileOpen(false);
    document.body.style.overflow = "";
  }, []);

  const goToCategory = (catId?: string) => {
    setCatOpen(false);
    closeMenu();
    navigate(catId ? `/catalog?category=${catId}` : "/catalog");
  };

  const isCatalogActive = location.pathname.startsWith("/catalog");

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border bg-background/82 backdrop-blur-2xl transition-transform duration-300 lg:translate-y-0 ${navHidden && !mobileOpen ? "-translate-y-full" : "translate-y-0"}`}>
      {/* Top bar */}
      <div className="hidden lg:block border-b border-border bg-white/55">
        <div className="container flex h-9 items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-2 uppercase tracking-[0.24em]">
            <Sparkles className="h-3.5 w-3.5 text-primary"/>BodyHome — товари для здоров'я та ортопедії
          </span>
          <div className="flex items-center gap-4">
            <a href={`tel:${PHONE}`} className="flex items-center gap-1.5 hover:text-primary transition-colors"><Phone className="h-3 w-3"/>{PHONE}</a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors"><TelegramIcon/>Telegram</a>
            <a href={VIBER} className="flex items-center gap-1.5 hover:text-primary transition-colors"><ViberIcon/>Viber</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container flex h-16 items-center gap-4 lg:gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0" aria-label="BodyHome — головна" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg viewBox="0 20 490 120" className="h-9 w-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="90" cy="90" r="65" fill="#3d7a55"/>
            <polyline points="35,90 53.8,90 63.8,61.2 73.8,118.8 83.8,73.8 93.8,106.2 103.8,90 152.5,90"
              fill="none" stroke="white" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="90" cy="90" r="5" fill="white"/>
            <text x="185" y="95" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="52" fill="#1a2420">Body</text>
            <text x="323" y="95" fontFamily="Arial,sans-serif" fontWeight="300" fontSize="52" fill="#3d7a55">Home</text>
            <line x1="185" y1="107" x2="487" y2="107" stroke="#3d7a55" strokeWidth="0.8" opacity="0.35"/>
          </svg>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center rounded-full border border-border bg-white/70 p-1 gap-0.5">
          <NavLink to="/" end className={({isActive}) => `rounded-full px-4 py-2 text-sm font-light transition-smooth ${isActive ? "bg-secondary text-primary" : "text-foreground/78 hover:bg-secondary hover:text-primary"}`}>
            Головна
          </NavLink>

          {/* Каталог mega-menu */}
          <div className="relative" ref={catRef}>
            <button type="button" onClick={() => { setCatOpen(o => !o); setBlogOpen(false); }}
              className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-light transition-smooth ${isCatalogActive || catOpen ? "bg-secondary text-primary" : "text-foreground/78 hover:bg-secondary hover:text-primary"}`}>
              Каталог <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full mt-2 w-[660px] rounded-2xl border border-border/60 bg-white shadow-2xl ring-1 ring-black/[0.06] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="grid grid-cols-3 divide-x divide-border/50">
                  {/* Col 1: За проблемою */}
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <p className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">За проблемою</p>
                    </div>
                    <div className="space-y-0.5">
                      {PROBLEM_ITEMS.map(({ Icon, label, url }) => (
                        <Link key={label} to={url} onClick={() => setCatOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 hover:bg-primary/8 group transition-colors">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
                          </span>
                          <span className="text-sm font-normal text-foreground group-hover:text-primary transition-colors">{label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Col 2: Категорії */}
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <p className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">Категорії</p>
                    </div>
                    <div className="space-y-0.5">
                      {categories.filter(c => !c.parentId).map(c => (
                        <button key={c.id} onClick={() => goToCategory(c.id)}
                          className="w-full text-left flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-sm font-normal text-foreground hover:bg-primary/8 hover:text-primary group transition-colors">
                          <span>{c.name}</span>
                          <ArrowRight className="h-3 w-3 text-primary/0 group-hover:text-primary/70 transition-all group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <button onClick={() => goToCategory()}
                        className="w-full text-left flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-semibold text-primary hover:bg-primary/8 transition-colors group">
                        Усі товари <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Col 3: Швидко знайти */}
                  <div className="p-4 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <p className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">Швидко знайти</p>
                    </div>
                    <div className="space-y-0.5">
                      {[
                        { Icon: Star, label: "Хіти продажів", url: "/catalog?q=хіт", badge: "🔥" },
                        { Icon: Zap, label: "Новинки", url: "/catalog?q=новинка", badge: "✨" },
                        { Icon: Heart, label: "Зі знижкою", url: "/catalog", badge: "%" },
                      ].map(({ Icon, label, url, badge }) => (
                        <Link key={label} to={url} onClick={() => setCatOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 hover:bg-primary/8 group transition-colors">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary group-hover:bg-primary/15 transition-colors text-sm">
                            {badge}
                          </span>
                          <span className="text-sm font-normal text-foreground group-hover:text-primary transition-colors">{label}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-1">Не знаєте що обрати?</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">Міла — AI-консультант підбере товар під ваш запит безкоштовно</p>
                      </div>
                      <button
                        onClick={() => { setCatOpen(false); document.querySelector<HTMLButtonElement>('[aria-label="Відкрити підтримку"]')?.click(); }}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-colors rounded-lg px-3 py-1.5 w-fit">
                        Запитати AI <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Блог dropdown */}
          <div className="relative" ref={blogRef}>
            <button type="button" onClick={() => { setBlogOpen(o => !o); setCatOpen(false); }}
              className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-light transition-smooth ${blogOpen ? "bg-secondary text-primary" : "text-foreground/78 hover:bg-secondary hover:text-primary"}`}>
              <BookOpen className="h-3.5 w-3.5" /> Блог <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${blogOpen ? "rotate-180" : ""}`} />
            </button>
            {blogOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-border bg-white/95 backdrop-blur-xl shadow-elevated p-2 z-50">
                <p className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Корисні статті</p>
                <div className="my-1 h-px bg-border" />
                {blogItems.map((item, i) => (
                  <Link key={i} to={item.link} onClick={() => setBlogOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary group transition-colors">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/8 group-hover:bg-primary/15 transition-colors">
                      <item.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] text-primary/90 uppercase tracking-wider">{item.tag}</p>
                      <p className="text-sm font-light text-foreground leading-snug">{item.label}</p>
                    </div>
                  </Link>
                ))}
                <div className="my-1 h-px bg-border" />
                <Link to="/blog" onClick={() => setBlogOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-secondary group transition-colors">
                  <span className="text-sm font-medium text-primary">Всі статті (20) →</span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            )}
          </div>

          <NavLink to="/about" className={({isActive}) => `rounded-full px-4 py-2 text-sm font-light transition-smooth ${isActive ? "bg-secondary text-primary" : "text-foreground/78 hover:bg-secondary hover:text-primary"}`}>
            Про нас
          </NavLink>

          <NavLink to="/contacts" className={({isActive}) => `rounded-full px-4 py-2 text-sm font-light transition-smooth ${isActive ? "bg-secondary text-primary" : "text-foreground/78 hover:bg-secondary hover:text-primary"}`}>
            Контакти
          </NavLink>
        </nav>

        {/* Search */}
        <SearchAutocomplete
          placeholder="Пошук подушок, устілок, масажерів..."
          className="hidden md:block flex-1 max-w-md ml-auto"
        />

        {/* Cart + burger */}
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <Button asChild variant="ghost" size="icon" className="relative rounded-full bg-white/75 text-primary hover:bg-secondary hover:text-primary">
            <Link to="/wishlist" aria-label="Вибране">
              <Heart className="h-5 w-5"/>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 min-w-5 px-1 place-items-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="relative rounded-full bg-white/75 text-primary hover:bg-secondary hover:text-primary">
            <Link to="/cart" aria-label="Кошик">
              <ShoppingCart className="h-5 w-5"/>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 min-w-5 px-1 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {totalCount}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon"
            className="lg:hidden rounded-full bg-white/75 h-11 w-11"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu">
            {mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
          </Button>
        </div>
      </div>

      {/* Mobile full-screen overlay menu — sits below sticky header, above BottomNav */}
      {mobileOpen && (
        <div
          id="mobile-nav-menu"
          className="lg:hidden fixed inset-x-0 bottom-0 z-40 overflow-y-auto bg-background"
          style={{ top: "4rem" }}
        >
          <div className="flex flex-col min-h-full pb-16">

            {/* Search */}
            <div className="px-4 pt-4 pb-3 border-b border-border">
              <SearchAutocomplete
                placeholder="Пошук товарів..."
                onNavigate={closeMenu}
              />
            </div>

            {/* За проблемою */}
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <p className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">За проблемою</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PROBLEM_ITEMS.map(({ Icon, label, url }) => (
                  <Link key={label} to={url} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 border border-border/50 bg-secondary/40 hover:bg-secondary hover:border-primary/30 active:scale-95 transition-all">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </span>
                    <span className="text-sm font-medium text-foreground leading-tight">{label}</span>
                  </Link>
                ))}
                <button
                  onClick={() => { closeMenu(); document.querySelector<HTMLButtonElement>('[aria-label="Відкрити підтримку"]')?.click(); }}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 border border-primary/30 bg-primary/5 hover:bg-primary/10 active:scale-95 transition-all">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  </span>
                  <span className="text-sm font-medium text-primary leading-tight">AI-підбір Міла</span>
                </button>
              </div>
            </div>

            {/* Головна link */}
            <div className="px-4 pb-1">
              <NavLink to="/" end onClick={() => { closeMenu(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive ? "bg-secondary text-primary" : "text-foreground hover:bg-secondary hover:text-primary"}`}>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Star className="h-4 w-4 text-primary" strokeWidth={1.5} />
                </span>
                Головна
              </NavLink>
            </div>

            {/* Категорії */}
            <div className="px-4 pt-4 pb-3 border-t border-border">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <p className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">Категорії</p>
              </div>
              <div className="space-y-0.5">
                {categories.filter(c => !c.parentId).map(c => {
                  const subs = categories.filter(s => s.parentId === c.id);
                  const isExpanded = expandedCat === c.id;
                  const CatIcon = CATEGORY_ICONS[c.id] ?? Heart;
                  return (
                    <div key={c.id}>
                      <button
                        onClick={() => subs.length > 0 ? setExpandedCat(isExpanded ? null : c.id) : goToCategory(c.id)}
                        className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${isExpanded ? "bg-secondary text-primary" : "text-foreground hover:bg-secondary hover:text-primary"}`}>
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${isExpanded ? "bg-primary/20" : "bg-primary/10"}`}>
                          <CatIcon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                        </span>
                        <span className="text-sm font-medium flex-1 text-left">{c.name}</span>
                        {subs.length > 0 && (
                          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        )}
                      </button>
                      {isExpanded && subs.length > 0 && (
                        <div className="pl-14 pr-3 pb-1 space-y-0.5">
                          <button onClick={() => goToCategory(c.id)}
                            className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5 transition-colors">
                            Всі в категорії →
                          </button>
                          {subs.map(s => (
                            <button key={s.id} onClick={() => goToCategory(s.id)}
                              className="w-full text-left rounded-xl px-3 py-2 text-sm text-foreground/70 hover:bg-secondary hover:text-primary transition-colors">
                              {s.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <button onClick={() => goToCategory()}
                  className="w-full flex items-center justify-between gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-primary hover:bg-primary/8 transition-colors group">
                  <span>Усі товари</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Блог */}
            <div className="px-4 pt-4 pb-3 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <p className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">Блог</p>
                </div>
                <Link to="/blog" onClick={closeMenu} className="text-xs font-medium text-primary hover:underline">
                  Всі статті →
                </Link>
              </div>
              <div className="space-y-0.5">
                {blogItems.slice(0, 3).map((item, i) => (
                  <Link key={i} to={item.link} onClick={closeMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary transition-colors">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] text-primary/80 uppercase tracking-wider">{item.tag}</p>
                      <p className="text-sm font-medium text-foreground leading-snug line-clamp-1">{item.label}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Про нас + Контакти */}
            <div className="px-4 pt-3 pb-3 border-t border-border">
              <div className="grid grid-cols-2 gap-2">
                <NavLink to="/about" onClick={closeMenu}
                  className={({ isActive }) => `flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive ? "bg-secondary text-primary" : "text-foreground hover:bg-secondary hover:text-primary"}`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Info className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  </span>
                  Про нас
                </NavLink>
                <NavLink to="/contacts" onClick={closeMenu}
                  className={({ isActive }) => `flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${isActive ? "bg-secondary text-primary" : "text-foreground hover:bg-secondary hover:text-primary"}`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" strokeWidth={1.5} />
                  </span>
                  Контакти
                </NavLink>
              </div>
            </div>

            {/* Contact info */}
            <div className="px-4 py-4 border-t border-border bg-secondary/30 mt-auto">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <a href={`tel:${PHONE}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary" />{PHONE}
                </a>
                <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                  <TelegramIcon />Telegram
                </a>
                <a href={VIBER} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                  <ViberIcon />Viber
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
