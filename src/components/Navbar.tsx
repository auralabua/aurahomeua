import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Phone, Sparkles, ChevronDown, ChevronRight, ArrowRight, BookOpen, Bone, Waves, Baby, Activity, Heart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useCategoriesAsLegacy } from "@/hooks/useShopData";
import { Button } from "@/components/ui/button";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";

const PHONE = "+380956981124";
const TELEGRAM = "https://t.me/bodyhomeua";
const VIBER = "viber://chat?number=%2B380956981124";

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
  const { categories } = useCategoriesAsLegacy();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
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

  const goToCategory = (catId?: string) => {
    setCatOpen(false);
    setMobileCatOpen(false);
    setMobileOpen(false);
    navigate(catId ? `/catalog?category=${catId}` : "/catalog");
  };

  const isCatalogActive = location.pathname.startsWith("/catalog");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/82 backdrop-blur-2xl">
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
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 ring-1 ring-primary/25 shadow-glow text-primary font-light text-lg">B</span>
          <span className="leading-none">
            <span className="block text-xl font-light tracking-[0.2em] uppercase">BodyHome</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center rounded-full border border-border bg-white/70 p-1 gap-0.5">
          <NavLink to="/" end className={({isActive}) => `rounded-full px-4 py-2 text-sm font-light transition-smooth ${isActive ? "bg-secondary text-primary" : "text-foreground/78 hover:bg-secondary hover:text-primary"}`}>
            Головна
          </NavLink>

          {/* Каталог dropdown */}
          <div className="relative" ref={catRef}>
            <button type="button" onClick={() => { setCatOpen(o => !o); setBlogOpen(false); }}
              className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-light transition-smooth ${isCatalogActive || catOpen ? "bg-secondary text-primary" : "text-foreground/78 hover:bg-secondary hover:text-primary"}`}>
              Каталог <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-border bg-white/95 backdrop-blur-xl shadow-elevated z-50 p-2">
                <button onClick={() => goToCategory()}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm font-light text-foreground/80 hover:bg-secondary hover:text-primary">
                  Усі товари
                </button>
                <div className="my-1 h-px bg-border" />
                {categories.filter(c => !c.parentId).map(c => {
                  const subs = categories.filter(s => s.parentId === c.id);
                  return (
                    <div key={c.id} className="group relative">
                      <button onClick={() => goToCategory(c.id)}
                        className="w-full text-left rounded-xl px-3 py-2 text-sm font-light text-foreground/80 hover:bg-secondary hover:text-primary flex items-center justify-between">
                        <span>{c.name}</span>
                        {subs.length > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-40" />}
                      </button>
                      {subs.length > 0 && (
                        <div className="absolute left-full top-0 ml-1 w-52 rounded-2xl border border-border bg-white/95 backdrop-blur-xl shadow-elevated p-2 hidden group-hover:block z-50">
                          {subs.map(s => (
                            <button key={s.id} onClick={() => goToCategory(s.id)}
                              className="w-full text-left rounded-xl px-3 py-2 text-xs font-light text-foreground/70 hover:bg-secondary hover:text-primary">
                              {s.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
                      <p className="text-[10px] text-primary/60 uppercase tracking-wider">{item.tag}</p>
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
            <Link to="/cart" aria-label="Кошик">
              <ShoppingCart className="h-5 w-5"/>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 grid h-5 min-w-5 px-1 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {totalCount}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden rounded-full bg-white/75" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 animate-fade-in">
          <div className="container py-4 space-y-3">
            <SearchAutocomplete
              placeholder="Пошук товарів..."
              onNavigate={() => setMobileOpen(false)}
            />

            <nav className="grid gap-1">
              <NavLink to="/" end onClick={() => setMobileOpen(false)} className={({isActive}) => `rounded-2xl px-4 py-3 text-sm font-light ${isActive ? "bg-secondary text-primary" : "text-foreground"}`}>
                Головна
              </NavLink>

              {/* Mobile Каталог */}
              <div className="rounded-2xl overflow-hidden border border-border/30">
                <button type="button" onClick={() => setMobileCatOpen(o => !o)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-light ${isCatalogActive ? "bg-secondary text-primary" : "text-foreground"}`}>
                  <span>Каталог</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileCatOpen ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileCatOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="bg-white/60 px-2 pb-2 pt-1 grid gap-0.5">
                    <button onClick={() => goToCategory()} className="text-left rounded-xl px-4 py-2.5 text-sm font-light text-foreground/85 hover:bg-secondary hover:text-primary transition-colors">
                      Усі товари
                    </button>
                    {categories.filter(c => !c.parentId).map(c => {
                      const subs = categories.filter(s => s.parentId === c.id);
                      const isExpanded = expandedCat === c.id;
                      return (
                        <div key={c.id}>
                          <button
                            onClick={() => subs.length > 0 ? setExpandedCat(isExpanded ? null : c.id) : goToCategory(c.id)}
                            className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-light transition-colors ${isExpanded ? "bg-secondary text-primary" : "text-foreground/85 hover:bg-secondary hover:text-primary"}`}>
                            <span>{c.name}</span>
                            {subs.length > 0 && (
                              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                            )}
                          </button>
                          {/* Підкатегорії з анімацією */}
                          <div className={`overflow-hidden transition-all duration-250 ease-in-out ${isExpanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                            <div className="pl-3 pr-1 pb-1 grid gap-0.5 border-l-2 border-primary/20 ml-4 mt-1 mb-1">
                              <button onClick={() => goToCategory(c.id)}
                                className="w-full text-left rounded-xl px-3 py-2 text-xs font-medium text-primary/80 hover:bg-primary/5 transition-colors">
                                Всі в категорії →
                              </button>
                              {subs.map(s => (
                                <button key={s.id} onClick={() => goToCategory(s.id)}
                                  className="w-full text-left rounded-xl px-3 py-2 text-xs font-light text-foreground/65 hover:bg-secondary hover:text-primary transition-colors">
                                  {s.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Блог */}
              <div className="rounded-2xl overflow-hidden border border-border/30">
                <button type="button" onClick={() => setMobileBlogOpen(o => !o)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-light text-foreground">
                  <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary"/>Блог</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileBlogOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileBlogOpen && (
                  <div className="bg-white/60 px-2 pb-2 pt-1 grid gap-0.5">
                    {blogItems.map((item, i) => (
                      <Link key={i} to={item.link} onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-secondary transition-colors">
                        <item.icon className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />
                        <span className="text-sm font-light text-foreground">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <NavLink to="/about" onClick={() => setMobileOpen(false)} className={({isActive}) => `rounded-2xl px-4 py-3 text-sm font-light ${isActive ? "bg-secondary text-primary" : "text-foreground"}`}>
                Про нас
              </NavLink>

              <NavLink to="/contacts" onClick={() => setMobileOpen(false)} className={({isActive}) => `rounded-2xl px-4 py-3 text-sm font-light ${isActive ? "bg-secondary text-primary" : "text-foreground"}`}>
                Контакти
              </NavLink>
            </nav>

            <div className="flex flex-wrap gap-3 border-t border-border pt-3 text-sm text-muted-foreground">
              <a href={`tel:${PHONE}`} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-primary"/>{PHONE}</a>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary"><TelegramIcon/>Telegram</a>
              <a href={VIBER} className="flex items-center gap-2 text-primary"><ViberIcon/>Viber</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
