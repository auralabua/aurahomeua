import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Banknote, Bell, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { formatUAH } from "@/data/products";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";

const startOfDayISO = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.toISOString(); };
const startOfWeekISO = () => { const d = new Date(); d.setDate(d.getDate() - 6); d.setHours(0, 0, 0, 0); return d.toISOString(); };
const startOfMonthISO = () => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d.toISOString(); };

const STATUS_LABELS: Record<string, string> = {
  new: "Нове", confirmed: "Підтверджено", shipped: "Відправлено",
  delivered: "Доставлено", cancelled: "Скасовано",
};
const STATUS_DOTS: Record<string, string> = {
  new: "bg-yellow-400", confirmed: "bg-blue-500", shipped: "bg-orange-500",
  delivered: "bg-green-600", cancelled: "bg-red-500",
};

const useDashboardStats = () =>
  useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const today = startOfDayISO();
      const week = startOfWeekISO();
      const month = startOfMonthISO();
      const [todayOrders, weekOrders, monthOrders, newOrders, products, recentOrders, lowStock] = await Promise.all([
        supabase.from("orders").select("amount, created_at").gte("created_at", today),
        supabase.from("orders").select("amount, created_at").gte("created_at", week),
        supabase.from("orders").select("amount, created_at").gte("created_at", month),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("admin_status", "new"),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id, order_reference, created_at, customer_name, customer_phone, amount, admin_status").order("created_at", { ascending: false }).limit(10),
        supabase.from("products").select("id, name, stock, images").lt("stock", 5).eq("available", true).order("stock").limit(10),
      ]);

      const sum = (arr: any[]) => (arr ?? []).reduce((s, r) => s + Number(r.amount || 0), 0);

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

      return {
        todayCount: todayOrders.data?.length ?? 0,
        todaySales: sum(todayOrders.data ?? []),
        weekSales: sum(weekOrders.data ?? []),
        monthSales: sum(monthOrders.data ?? []),
        newOrdersCount: newOrders.count ?? 0,
        productsCount: products.count ?? 0,
        chartData: Object.entries(days).map(([date, sales]) => ({ date, sales })),
        recentOrders: recentOrders.data ?? [],
        lowStockProducts: lowStock.data ?? [],
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

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard icon={ShoppingBag} label="Замовлень сьогодні" value={L ? "—" : data?.todayCount ?? 0} />
        <StatCard icon={Banknote} label="Продажів сьогодні" value={L ? "—" : formatUAH(data?.todaySales ?? 0)} accent />
        <StatCard icon={TrendingUp} label="За тиждень" value={L ? "—" : formatUAH(data?.weekSales ?? 0)} sub="останні 7 днів" />
        <StatCard icon={TrendingUp} label="За місяць" value={L ? "—" : formatUAH(data?.monthSales ?? 0)} sub="цього місяця" />
        <StatCard icon={Bell} label="Нові замовлення" value={L ? "—" : data?.newOrdersCount ?? 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales chart */}
        <div className="rounded-2xl bg-card border border-border/60 p-6">
          <h2 className="text-lg font-light mb-4">Продажі за 7 днів</h2>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">Завантаження…</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data?.chartData ?? []} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => v > 0 ? `${Math.round(v / 1000)}к` : "0"} />
                <Tooltip
                  formatter={(v: number) => [formatUAH(v), "Продажі"]}
                  contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", fontSize: 12 }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Low stock */}
        <div className="rounded-2xl bg-card border border-border/60 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="text-lg font-light">Малий залишок</h2>
            <span className="text-xs text-muted-foreground ml-auto">менше 5 шт.</span>
          </div>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">Завантаження…</div>
          ) : (data?.lowStockProducts ?? []).length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Всі товари в достатній кількості</div>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {(data?.lowStockProducts ?? []).map((p: any) => (
                <div key={p.id} className="flex items-center gap-3">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="h-9 w-9 rounded-lg object-contain bg-secondary shrink-0" />
                  ) : (
                    <div className="h-9 w-9 rounded-lg bg-secondary shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-1">{p.name}</p>
                  </div>
                  <span className={`text-sm font-semibold shrink-0 ${p.stock === 0 ? "text-destructive" : "text-amber-600"}`}>
                    {p.stock} шт.
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl bg-card border border-border/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-light">Останні замовлення</h2>
          <Link to="/admin/orders" className="text-sm text-primary hover:underline">Всі замовлення →</Link>
        </div>
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">Завантаження…</div>
        ) : (data?.recentOrders ?? []).length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">Замовлень ще немає</div>
        ) : (
          <div className="space-y-1">
            {(data?.recentOrders ?? []).map((o: any) => (
              <div key={o.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                <span className={`h-2 w-2 rounded-full shrink-0 ${STATUS_DOTS[o.admin_status] ?? "bg-muted"}`} />
                <span className="text-xs text-muted-foreground font-mono w-20 shrink-0 truncate">
                  {o.order_reference || o.id.slice(0, 8)}
                </span>
                <span className="text-sm flex-1 truncate">{o.customer_name}</span>
                <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                  {new Date(o.created_at).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="text-sm font-medium shrink-0 whitespace-nowrap">{formatUAH(Number(o.amount))}</span>
                <span className="text-xs text-muted-foreground shrink-0 hidden md:block">
                  {STATUS_LABELS[o.admin_status] ?? o.admin_status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Нові замовлення", href: "/admin/orders", count: data?.newOrdersCount },
          { label: "Всі товари", href: "/admin/products", count: data?.productsCount },
          { label: "Малий залишок", href: "/admin/products", count: data?.lowStockProducts?.length },
          { label: "Категорії", href: "/admin/categories", count: undefined },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.href}
            className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-soft transition-all"
          >
            <span className="text-sm font-light">{item.label}</span>
            {item.count !== undefined && (
              <span className="text-sm text-primary font-medium">{item.count}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
