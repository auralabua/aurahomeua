import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Banknote, Bell, Package } from "lucide-react";
import { formatUAH } from "@/data/products";

const startOfDayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const useDashboardStats = () =>
  useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const today = startOfDayISO();
      const [todayOrders, newOrders, products] = await Promise.all([
        supabase.from("orders").select("amount, created_at").gte("created_at", today),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("admin_status", "new"),
        supabase.from("products").select("id", { count: "exact", head: true }),
      ]);
      const sales = (todayOrders.data ?? []).reduce((s, r: any) => s + Number(r.amount || 0), 0);
      return {
        todayOrdersCount: todayOrders.data?.length ?? 0,
        todaySales: sales,
        newOrdersCount: newOrders.count ?? 0,
        productsCount: products.count ?? 0,
      };
    },
  });

const StatCard = ({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  accent?: boolean;
}) => (
  <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-soft">
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`grid h-10 w-10 place-items-center rounded-xl ${
          accent ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
    <div className="text-3xl font-light">{value}</div>
  </div>
);

const AdminDashboard = () => {
  const { data, isLoading } = useDashboardStats();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl">Дашборд</h1>
        <p className="text-muted-foreground text-sm mt-1">Огляд активності за сьогодні</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Замовлень сьогодні" value={isLoading ? "—" : data?.todayOrdersCount ?? 0} />
        <StatCard
          icon={Banknote}
          label="Продажів сьогодні"
          value={isLoading ? "—" : formatUAH(data?.todaySales ?? 0)}
          accent
        />
        <StatCard icon={Bell} label="Нові замовлення" value={isLoading ? "—" : data?.newOrdersCount ?? 0} />
        <StatCard icon={Package} label="Товарів у каталозі" value={isLoading ? "—" : data?.productsCount ?? 0} />
      </div>
    </div>
  );
};

export default AdminDashboard;
