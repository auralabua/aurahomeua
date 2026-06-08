import { useState } from "react";
import { Outlet, Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  LayoutDashboard, ShoppingBag, Package, FolderTree,
  Users, Settings, LogOut, Menu, X, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/admin", label: "Дашборд", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Замовлення", icon: ShoppingBag },
  { to: "/admin/products", label: "Товари", icon: Package },
  { to: "/admin/categories", label: "Категорії", icon: FolderTree },
  { to: "/admin/customers", label: "Клієнти", icon: Users },
  { to: "/admin/support", label: "Підтримка", icon: MessageCircle },
  { to: "/admin/settings", label: "Налаштування", icon: Settings },
];

const SidebarContent = ({ onClose, onSignOut }: { onClose?: () => void; onSignOut: () => void }) => (
  <>
    <nav className="flex-1 space-y-0.5 px-3 py-4">
      {NAV.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
    <div className="px-3 pb-4 border-t border-border/40 pt-3">
      <button
        onClick={onSignOut}
        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Вийти
      </button>
    </div>
  </>
);

const AdminLayout = () => {
  const { session, isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />;

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Виконано вихід" });
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-border/60 bg-card shrink-0 fixed top-0 bottom-0 left-0">
        <div className="px-5 py-5 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/12 text-primary text-sm font-semibold">B</span>
            <div>
              <div className="text-sm font-medium">BodyHome</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Адмін-панель</div>
            </div>
          </div>
        </div>
        <SidebarContent onSignOut={signOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-card border-b border-border/60 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/12 text-primary text-sm font-semibold">B</span>
          <span className="text-sm font-medium">BodyHome Адмін</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-card flex flex-col pt-14"
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent onClose={() => setMobileOpen(false)} onSignOut={signOut} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-56 overflow-auto">
        <div className="h-14 md:hidden" />
        <div className="p-4 md:p-6 lg:p-8 max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
