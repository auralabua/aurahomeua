import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PHONE = "+380956981124";
const TELEGRAM = "https://t.me/aurahomeua";
const VIBER = "viber://chat?number=%2B380956981124";

const navItems = [
  { to: "/", label: "Головна" },
  { to: "/catalog", label: "Каталог" },
  { to: "/about", label: "Про нас" },
  { to: "/contacts", label: "Контакти" },
];

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z"/>
  </svg>
);

const ViberIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M11.4 0C6.37.03 2.33 2.4.64 6.37c-.97 2.3-1.03 4.74-.97 7.18.06 2.44.13 4.88 1.36 7.07 1.23 2.2 3.34 3.8 5.7 4.5.3.09.62.12.94.07l-.01-4.97c-.3-.1-.58-.24-.84-.42a5.3 5.3 0 01-2.02-3.73c-.1-2.52.26-5.18 1.84-7.22C8.27 6.5 10.73 5.7 13.1 5.7c2.37 0 4.72.97 6.2 2.8 1.48 1.85 1.8 4.38 1.72 6.7-.08 2.3-.48 4.73-1.97 6.54-1.5 1.8-3.9 2.7-6.2 2.57-.6-.03-1.18-.15-1.74-.33l-.01 4.97c.55.12 1.1.14 1.65.1 3.28-.22 6.36-1.84 8.3-4.43 1.94-2.6 2.46-5.9 2.46-9.08 0-3.18-.52-6.48-2.46-9.08C18.98 1.9 15.26.22 11.4 0z"/>
  </svg>
);

export const Navbar = () => {
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/catalog${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="hidden lg:block border-b border-border/40 bg-secondary/40">
        <div className="container flex items-center justify-end gap-4 h-9">
          <a href={`tel:${PHONE}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-light">
            <Phone className="h-3 w-3" /> {PHONE}
          </a>
          <div className="w-px h-3 bg-border" />
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#229ED9] transition-colors font-light">
            <TelegramIcon /> Telegram
          </a>
          <a href={VIBER} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#7360F2] transition-colors font-light">
            <ViberIcon /> Viber
          </a>
        </div>
      </div>

      <div className="container flex h-16 items-center gap-4 lg:gap-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl font-light tracking-wide text-foreground">Aura Home</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}
              className={({ isActive }) => `px-3 py-2 text-sm font-light no-underline transition-smooth ${isActive ? "text-primary" : "text-foreground hover:text-primary"}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={onSearch} className="hidden md:flex relative flex-1 max-w-md ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Пошук товарів..."
            className="pl-9 rounded-full bg-secondary/60 border-transparent focus-visible:bg-background" />
        </form>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <div className="flex lg:hidden items-center gap-1">
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-full text-[#229ED9] hover:bg-secondary transition-colors" aria-label="Telegram">
              <TelegramIcon />
            </a>
            <a href={VIBER} className="grid h-8 w-8 place-items-center rounded-full text-[#7360F2] hover:bg-secondary transition-colors" aria-label="Viber">
              <ViberIcon />
            </a>
          </div>

          <Button asChild variant="ghost" size="icon" className="relative rounded-full text-primary hover:text-primary hover:bg-secondary">
            <Link to="/cart" aria-label="Кошик">
              <ShoppingCart className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 px-1 place-items-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {totalCount}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setMobileOpen(o => !o)} aria-label="Меню">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-4 space-y-3">
            <form onSubmit={onSearch} className="relative md:hidden">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Пошук товарів..." className="pl-9 rounded-full" />
            </form>
            <nav className="flex flex-col">
              {navItems.map(item => (
                <NavLink key={item.to} to={item.to} end={item.to === "/"} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `px-3 py-3 font-light ${isActive ? "text-primary" : "text-foreground"}`}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-border/40 pt-3 flex items-center gap-4">
              <a href={`tel:${PHONE}`} className="flex items-center gap-1.5 text-sm text-muted-foreground font-light">
                <Phone className="h-4 w-4" /> {PHONE}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
