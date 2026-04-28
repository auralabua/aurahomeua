import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, Heart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  { to: "/", label: "Головна" },
  { to: "/catalog", label: "Каталог" },
  { to: "/about", label: "Про нас" },
  { to: "/contacts", label: "Контакти" },
];

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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="container flex h-16 items-center gap-4 lg:gap-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-glow">
            <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-primary">OLVI</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  isActive ? "text-primary bg-primary-soft" : "text-foreground/75 hover:text-primary hover:bg-secondary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={onSearch} className="hidden md:flex relative flex-1 max-w-md ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Пошук товарів..."
            className="pl-9 rounded-full bg-secondary/60 border-transparent focus-visible:bg-background"
          />
        </form>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <Button asChild variant="ghost" size="icon" className="relative rounded-full">
            <Link to="/cart" aria-label="Кошик">
              <ShoppingCart className="h-5 w-5" />
              {totalCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 px-1 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-soft">
                  {totalCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Меню"
          >
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
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-3 rounded-md font-medium ${isActive ? "text-primary bg-primary-soft" : "text-foreground/80"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
