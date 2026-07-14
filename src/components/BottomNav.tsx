import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Search, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SearchAutocomplete } from "./SearchAutocomplete";

export const BottomNav = () => {
  const location = useLocation();
  const { totalCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  // Hide on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* Full-screen search overlay */}
      {searchOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[110] bg-background/97 backdrop-blur-md animate-in fade-in duration-150"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-border/50">
            <SearchAutocomplete
              placeholder="Пошук товарів..."
              className="flex-1"
              onNavigate={() => setSearchOpen(false)}
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="shrink-0 text-sm font-medium text-primary px-2 py-1"
            >
              Скасувати
            </button>
          </div>
          <div className="px-4 pt-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">
              Популярні запити
            </p>
            <div className="flex flex-wrap gap-2">
              {["ортопедична подушка", "масажер", "устілки", "бандаж", "масажний килимок"].map(q => (
                <button
                  key={q}
                  onClick={() => { window.location.href = `/catalog?q=${encodeURIComponent(q)}`; setSearchOpen(false); }}
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-foreground/70 hover:border-primary/40 hover:text-primary active:bg-primary/5 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/97 backdrop-blur-xl border-t border-border/50 shadow-[0_-4px_24px_rgba(0,0,0,0.07)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Мобільна навігація"
      >
        <div className="grid grid-cols-4 h-14">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
              isActive("/") ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Home className={`h-5 w-5 ${isActive("/") ? "stroke-[2]" : "stroke-[1.5]"}`} />
            <span className="text-[9px] font-medium">Головна</span>
          </Link>

          <Link
            to="/catalog"
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95 ${
              isActive("/catalog") ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <LayoutGrid className={`h-5 w-5 ${isActive("/catalog") ? "stroke-[2]" : "stroke-[1.5]"}`} />
            <span className="text-[9px] font-medium">Каталог</span>
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-primary active:scale-95 transition-colors"
            aria-label="Пошук"
          >
            <Search className="h-5 w-5 stroke-[1.5]" />
            <span className="text-[9px] font-medium">Пошук</span>
          </button>

          <Link
            to="/cart"
            className={`flex flex-col items-center justify-center gap-0.5 relative transition-colors active:scale-95 ${
              isActive("/cart") ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            <div className="relative">
              <ShoppingCart className={`h-5 w-5 ${isActive("/cart") ? "stroke-[2]" : "stroke-[1.5]"}`} />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 px-0.5 place-items-center rounded-full bg-primary text-[9px] font-bold text-white leading-none">
                  {totalCount > 9 ? "9+" : totalCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-medium">Кошик</span>
          </Link>
        </div>
      </nav>
    </>
  );
};
