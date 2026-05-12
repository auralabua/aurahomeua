import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Banknote, Bell, Package, TrendingUp, Users } from "lucide-react";
import { formatUAH } from "@/data/products";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const startOfDayISO = () => {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString();
};
const startOfWeekISO = () => {
  const d = new Date(); d.setDate(d.getDate() - 6); d.setHours(0, 0, 0, 0); return d.toISOString();
};
const startOfMonthISO = () => {
  const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d.toISOString();
};

const useDashboardStats = () =>
  useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const today = startOfDayISO();
      const week = startOfWeekISO();
      const month = startOfMonthISO();
      const [todayOrders, weekOrders, monthOrders, newOrders, products, customers] = await Promise.all([
        supabase.from("orders").select("amount, created_at").gte("created_at", today),
        supabase.from("orders").select("amount, created_at").gte("created_at", week),
        supabase.from("orders").select("amount, created_at").gte("created_at", month),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("admin_status", "new"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("customer_phone", { count: "exact", head: true }),
      ]);

      const sum = (arr: any[]) => (arr ?? []).reduce((s, r) => s + Number(r.amount || 0), 0);

      // Chart data — last 7 days
      const days: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit" });
        days[key] = 0;
      }
      (weekOrders.data ?? []).forEach((o: any) => {
        const key = new Date(o.created_at).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit" });
        if (key in days) days[key] += Number(o.amount || 0);
      });
      const chartData = Object.entries(days).map(([date, sales]) => ({ date, sales }));

      return {
        todayCount: todayOrders.data?.length ?? 0,
        todaySales: sum(todayOrders.data ?? []),
        weekSales: sum(weekOrders.data ?? []),
        monthSales: sum(monthOrders.data ?? []),
        newOrdersCount: newOrders.count ?? 0,
        productsCount: products.count ?? 0,
        customersCount: customers.count ?? 0,
        chartData,
      };
    },
  });

const StatCard = ({ icon: Icon, label, value, sub, accent = false }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string | number; sub?: string; accent?: boolean;
}) => (
  <div className="p-5 rounded-2xl bg-card border border-border/60 shadow-soft">
    <div className="flex items-center gap-3 mb-3">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
    <div className="text-3xl font-light">{value}</div>
    {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
  </div>
);

const AdminDashboard = () => {
  const { data, isLoading } = useDashboardStats();
  const L = isLoading;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl">Дашборд</h1>
        <p className="text-muted-foreground text-sm mt-1">Огляд активності магазину</p>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={ShoppingBag} label="Замовлень сьогодні" value={L ? "—" : data?.todayCount ?? 0} />
        <StatCard icon={Banknote} label="Продажів сьогодні" value={L ? "—" : formatUAH(data?.todaySales ?? 0)} accent />
        <StatCard icon={TrendingUp} label="Продажів за тиждень" value={L ? "—" : formatUAH(data?.weekSales ?? 0)} sub="останні 7 днів" />
        <StatCard icon={TrendingUp} label="Продажів за місяць" value={L ? "—" : formatUAH(data?.monthSales ?? 0)} sub="цього місяця" />
        <StatCard icon={Bell} label="Нові замовлення" value={L ? "—" : data?.newOrdersCount ?? 0} />
        <StatCard icon={Package} label="Товарів у каталозі" value={L ? "—" : data?.productsCount ?? 0} />
      </div>

      {/* Sales chart */}
      <div className="rounded-2xl bg-card border border-border/60 p-6">
        <h2 className="text-lg font-light mb-6">Продажі за останні 7 днів</h2>
        {isLoading ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground">Завантаження…</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.chartData ?? []} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => v > 0 ? `${v/1000}к` : "0"} />
              <Tooltip
                formatter={(v: number) => [formatUAH(v), "Продажі"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: 13 }}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Нові замовлення", href: "/admin/orders", count: data?.newOrdersCount },
          { label: "Всі товари", href: "/admin/products", count: data?.productsCount },
          { label: "Клієнти", href: "/admin/customers", count: data?.customersCount },
          { label: "Категорії", href: "/admin/categories", count: undefined },
        ].map((item, i) => (
          <a key={i} href={item.href}
            className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-soft transition-all">
            <span className="text-sm font-light">{item.label}</span>
            {item.count !== undefined && (
              <span className="text-sm text-primary font-medium">{item.count}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
