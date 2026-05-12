import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Phone, Sparkles, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useCategoriesAsLegacy } from "@/hooks/useShopData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PHONE = "+380956981124";
const TELEGRAM = "https://t.me/aurahomeua";
const VIBER = "viber://chat?number=%2B380956981124";
const navItems = [
  { to: "/", label: "Головна" },
  { to: "/about", label: "Бренд" },
  { to: "/contacts", label: "Контакти" },
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
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/catalog${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
    setMobileOpen(false);
  };

  const goToCategory = (catId?: string) => {
    setCatOpen(false);
    setMobileCatOpen(false);
    setMobileOpen(false);
    navigate(catId ? `/catalog?category=${catId}` : "/catalog");
  };

  const isCatalogActive = location.pathname.startsWith("/catalog");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/82 backdrop-blur-2xl">
      <div className="hidden lg:block border-b border-border bg-white/55">
        <div className="container flex h-9 items-center justify-between text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-2 uppercase tracking-[0.24em]"><Sparkles className="h-3.5 w-3.5 text-primary"/>товари для здоровʼя та ортопедії</span>
          <div className="flex items-center gap-4">
            <a href={`tel:${PHONE}`} className="flex items-center gap-1.5 hover:text-primary"><Phone className="h-3 w-3"/>{PHONE}</a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary"><TelegramIcon/>Telegram</a>
            <a href={VIBER} className="flex items-center gap-1.5 hover:text-primary"><ViberIcon/>Viber</a>
          </div>
        </div>
      </div>
      <div className="container flex h-16 items-center gap-4 lg:gap-8">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 ring-1 ring-primary/25 shadow-glow text-primary">A</span>
          <span className="leading-none">
            <span className="block text-xl font-light tracking-[0.16em] uppercase">Aura</span>
            <span className="block text-[10px] tracking-[0.34em] text-muted-foreground uppercase">Well</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center rounded-full border border-border bg-white/70 p-1">
          <NavLink to="/" end className={({isActive})=>`rounded-full px-4 py-2 text-sm font-light transition-smooth ${isActive?"bg-secondary text-primary":"text-foreground/78 hover:bg-secondary hover:text-primary"}`}>Головна</NavLink>

          <div className="relative" ref={catRef}>
            <button
              type="button"
              onClick={() => setCatOpen(o => !o)}
              className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-light transition-smooth ${isCatalogActive || catOpen ? "bg-secondary text-primary" : "text-foreground/78 hover:bg-secondary hover:text-primary"}`}
            >
              Каталог <ChevronDown className={`h-3.5 w-3.5 transition-transform ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-border bg-white/95 backdrop-blur-xl shadow-elevated p-2 animate-fade-in z-50">
                <button
                  onClick={() => goToCategory()}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm font-light text-foreground/80 hover:bg-secondary hover:text-primary"
                >
                  Усі товари
                </button>
                <div className="my-1 h-px bg-border" />
                {categories.filter(c => !c.parentId).map(c => {
                  const subs = categories.filter(s => s.parentId === c.id);
                  return (
                    <div key={c.id}>
                      <button
                        onClick={() => goToCategory(c.id)}
                        className="w-full text-left rounded-xl px-3 py-2 text-sm font-light text-foreground/80 hover:bg-secondary hover:text-primary"
                      >
                        {c.name}
                      </button>
                      {subs.length > 0 && (
                        <div className="ml-3 border-l border-border/60 pl-2">
                          {subs.map(s => (
                            <button
                              key={s.id}
                              onClick={() => goToCategory(s.id)}
                              className="w-full text-left rounded-xl px-3 py-1.5 text-xs font-light text-foreground/65 hover:bg-secondary hover:text-primary"
                            >
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

          {navItems.filter(i => i.to !== "/").map(item => (
            <NavLink key={item.to} to={item.to} className={({isActive})=>`rounded-full px-4 py-2 text-sm font-light transition-smooth ${isActive?"bg-secondary text-primary":"text-foreground/78 hover:bg-secondary hover:text-primary"}`}>{item.label}</NavLink>
          ))}
        </nav>

        <form onSubmit={onSearch} className="hidden md:flex relative flex-1 max-w-md ml-auto">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
          <Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Пошук подушок, устілок, масажерів..." className="h-11 rounded-full border-border bg-white/75 pl-10 text-sm"/>
        </form>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <Button asChild variant="ghost" size="icon" className="relative rounded-full bg-white/75 text-primary hover:bg-secondary hover:text-primary">
            <Link to="/cart" aria-label="Кошик">
              <ShoppingCart className="h-5 w-5"/>
              {totalCount>0&&<span className="absolute -top-1 -right-1 grid h-5 min-w-5 px-1 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">{totalCount}</span>}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden rounded-full bg-white/75" onClick={()=>setMobileOpen(o=>!o)}>
            {mobileOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 animate-fade-in">
          <div className="container py-4 space-y-4">
            <form onSubmit={onSearch} className="relative md:hidden">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
              <Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Пошук товарів..." className="rounded-full bg-white/75 border-border pl-10"/>
            </form>
            <nav className="grid gap-2">
              <NavLink to="/" end onClick={()=>setMobileOpen(false)} className={({isActive})=>`rounded-2xl px-4 py-3 font-light ${isActive?"bg-secondary text-primary":"text-foreground"}`}>Головна</NavLink>

              <div className="rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMobileCatOpen(o => !o)}
                  className={`w-full flex items-center justify-between px-4 py-3 font-light ${isCatalogActive ? "bg-secondary text-primary" : "text-foreground"}`}
                >
                  <span>Каталог</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileCatOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileCatOpen && (
                  <div className="bg-white/60 pl-2 pr-2 pb-2 pt-1 grid gap-1">
                    <button onClick={() => goToCategory()} className="text-left rounded-xl px-4 py-2.5 text-sm font-light text-foreground/85 hover:bg-secondary hover:text-primary">
                      Усі товари
                    </button>
                    {categories.filter(c => !c.parentId).map(c => {
                      const subs = categories.filter(s => s.parentId === c.id);
                      return (
                        <div key={c.id}>
                          <button onClick={() => goToCategory(c.id)} className="w-full text-left rounded-xl px-4 py-2.5 text-sm font-light text-foreground/85 hover:bg-secondary hover:text-primary">
                            {c.name}
                          </button>
                          {subs.map(s => (
                            <button key={s.id} onClick={() => goToCategory(s.id)} className="w-full text-left rounded-xl px-7 py-2 text-xs font-light text-foreground/65 hover:bg-secondary hover:text-primary">
                              {s.name}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {navItems.filter(i => i.to !== "/").map(item => (
                <NavLink key={item.to} to={item.to} onClick={()=>setMobileOpen(false)} className={({isActive})=>`rounded-2xl px-4 py-3 font-light ${isActive?"bg-secondary text-primary":"text-foreground"}`}>{item.label}</NavLink>
              ))}
            </nav>
            <div className="flex flex-wrap gap-3 border-t border-border pt-4 text-sm text-muted-foreground">
              <a href={`tel:${PHONE}`} className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary"/>{PHONE}</a>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary"><TelegramIcon/>Telegram</a>
              <a href={VIBER} className="flex items-center gap-2 text-primary"><ViberIcon/>Viber</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
