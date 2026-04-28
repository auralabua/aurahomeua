import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Users,
  LogOut,
  Loader2,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { to: "/admin", end: true, label: "Дашборд", icon: LayoutDashboard },
  { to: "/admin/orders", label: "Замовлення", icon: ShoppingBag },
  { to: "/admin/products", label: "Товари", icon: Package },
  { to: "/admin/categories", label: "Категорії", icon: Tag },
  { to: "/admin/customers", label: "Клієнти", icon: Users },
];

const SidebarContent = ({ onNav }: { onNav?: () => void }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6 border-b border-border/60">
        <div className="text-lg font-light tracking-tight">Aura Home</div>
        <div className="text-xs text-muted-foreground">Адмін-панель</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNav}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-smooth",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-foreground/80 hover:bg-secondary",
              )
            }
          >
            <item.icon className="h-4 w-4" strokeWidth={1.6} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-border/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/80 hover:bg-secondary transition-smooth"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.6} />
          Вийти
        </button>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const { session, isAdmin, loading } = useAdminAuth();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl">Доступ обмежено</h1>
          <p className="text-muted-foreground">
            Ваш акаунт не має ролі адміністратора. Зверніться до власника сайту.
          </p>
          <Button onClick={() => supabase.auth.signOut()} variant="outline" className="rounded-full">
            Вийти
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-secondary/60 border-r border-border/60">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <div className="md:hidden fixed top-3 left-3 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="rounded-full bg-card shadow-soft">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent onNav={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-8 pt-16 md:pt-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
