import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatUAH } from "@/data/products";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface OrderRow {
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  amount: number;
}

interface Customer {
  phone: string;
  name: string;
  email: string | null;
  ordersCount: number;
  totalSpent: number;
}

const AdminCustomers = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("customer_name, customer_phone, customer_email, amount")
        .limit(2000);
      if (error) throw error;

      const map = new Map<string, Customer>();
      for (const r of (data ?? []) as OrderRow[]) {
        const key = (r.customer_phone || "").trim();
        if (!key) continue;
        const existing = map.get(key);
        if (existing) {
          existing.ordersCount++;
          existing.totalSpent += Number(r.amount);
          if (!existing.email && r.customer_email) existing.email = r.customer_email;
        } else {
          map.set(key, {
            phone: key,
            name: r.customer_name,
            email: r.customer_email,
            ordersCount: 1,
            totalSpent: Number(r.amount),
          });
        }
      }
      return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl">Клієнти</h1>
        <p className="text-muted-foreground text-sm mt-1">{data?.length ?? 0} клієнтів</p>
      </header>

      <div className="rounded-2xl bg-card border border-border/60 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ім'я</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Замовлень</TableHead>
              <TableHead className="text-right">Сума покупок</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Завантаження…</TableCell></TableRow>
            ) : (data ?? []).length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Поки немає клієнтів</TableCell></TableRow>
            ) : (data ?? []).map((c) => (
              <TableRow key={c.phone}>
                <TableCell>{c.name}</TableCell>
                <TableCell className="whitespace-nowrap">{c.phone}</TableCell>
                <TableCell className="text-muted-foreground">{c.email ?? "—"}</TableCell>
                <TableCell className="text-right font-medium">{c.ordersCount}</TableCell>
                <TableCell className="text-right font-medium whitespace-nowrap">{formatUAH(c.totalSpent)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCustomers;
