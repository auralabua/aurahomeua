import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatUAH } from "@/data/products";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const STATUSES: Record<string, { label: string; dot: string }> = {
  new: { label: "Нове", dot: "bg-yellow-400" },
  processing: { label: "В обробці", dot: "bg-blue-500" },
  shipped: { label: "Відправлено", dot: "bg-orange-500" },
  completed: { label: "Виконано", dot: "bg-green-500" },
  cancelled: { label: "Скасовано", dot: "bg-red-500" },
};

interface Order {
  id: string;
  order_reference: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  amount: number;
  items: any;
  delivery_method: string | null;
  delivery_city: string | null;
  delivery_branch: string | null;
  payment_method: string | null;
  admin_status: string;
  status: string;
}

const AdminOrders = () => {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deliveryFilter, setDeliveryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data as Order[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ admin_status: status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({ title: "Статус оновлено" });
    },
    onError: (e: any) => toast({ title: "Помилка", description: e.message, variant: "destructive" }),
  });

  const filtered = useMemo(() => {
    return (data ?? []).filter((o) => {
      if (statusFilter !== "all" && o.admin_status !== statusFilter) return false;
      if (deliveryFilter !== "all" && o.delivery_method !== deliveryFilter) return false;
      if (dateFilter) {
        const d = new Date(o.created_at).toISOString().slice(0, 10);
        if (d !== dateFilter) return false;
      }
      return true;
    });
  }, [data, statusFilter, deliveryFilter, dateFilter]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl">Замовлення</h1>
        <p className="text-muted-foreground text-sm mt-1">{filtered.length} замовлень</p>
      </header>

      <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-card border border-border/60">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] rounded-xl">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі статуси</SelectItem>
            {Object.entries(STATUSES).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
          <SelectTrigger className="w-[200px] rounded-xl">
            <SelectValue placeholder="Доставка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Уся доставка</SelectItem>
            <SelectItem value="novaposhta">Нова Пошта</SelectItem>
            <SelectItem value="mistexpress">MistExpress</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-[180px] rounded-xl"
        />
      </div>

      <div className="rounded-2xl bg-card border border-border/60 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Клієнт</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Товари</TableHead>
              <TableHead>Сума</TableHead>
              <TableHead>Доставка</TableHead>
              <TableHead>Оплата</TableHead>
              <TableHead className="min-w-[180px]">Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={9} className="text-center py-10 text-muted-foreground">Завантаження…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center py-10 text-muted-foreground">Замовлень не знайдено</TableCell></TableRow>
            ) : filtered.map((o) => {
              const items = Array.isArray(o.items) ? o.items : [];
              const itemsSummary = items.slice(0, 2).map((i: any) => i.name).join(", ") + (items.length > 2 ? ` +${items.length - 2}` : "");
              return (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.order_reference}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">
                    {new Date(o.created_at).toLocaleString("uk-UA", { dateStyle: "short", timeStyle: "short" })}
                  </TableCell>
                  <TableCell>{o.customer_name}</TableCell>
                  <TableCell className="whitespace-nowrap">{o.customer_phone}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm" title={itemsSummary}>{itemsSummary || "—"}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap">{formatUAH(Number(o.amount))}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {o.delivery_method === "novaposhta" ? "Нова Пошта" : o.delivery_method === "mistexpress" ? "MistExpress" : "—"}
                    {o.delivery_city && <div className="text-xs text-muted-foreground">{o.delivery_city}, {o.delivery_branch}</div>}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {o.payment_method === "wayforpay" ? "WayForPay" : o.payment_method === "cod" ? "При отриманні" : "—"}
                  </TableCell>
                  <TableCell>
                    <Select value={o.admin_status} onValueChange={(v) => updateStatus.mutate({ id: o.id, status: v })}>
                      <SelectTrigger className="rounded-xl h-9">
                        <SelectValue>
                          <span className="inline-flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${STATUSES[o.admin_status]?.dot ?? "bg-muted"}`} />
                            {STATUSES[o.admin_status]?.label ?? o.admin_status}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUSES).map(([k, v]) => (
                          <SelectItem key={k} value={k}>
                            <span className="inline-flex items-center gap-2">
                              <span className={`h-2 w-2 rounded-full ${v.dot}`} />{v.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
