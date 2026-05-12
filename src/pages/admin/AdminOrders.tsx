import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatUAH } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Phone, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

const STATUSES: Record<string, { label: string; dot: string }> = {
  new: { label: "Нове", dot: "bg-yellow-400" },
  processing: { label: "В обробці", dot: "bg-blue-500" },
  shipped: { label: "Відправлено", dot: "bg-orange-500" },
  completed: { label: "Виконано", dot: "bg-green-500" },
  cancelled: { label: "Скасовано", dot: "bg-red-500" },
};

interface Order {
  id: string; order_reference: string; created_at: string;
  customer_name: string; customer_phone: string; customer_email: string | null;
  amount: number; items: any; delivery_method: string | null;
  delivery_city: string | null; delivery_branch: string | null;
  payment_method: string | null; admin_status: string; status: string;
}

const AdminOrders = () => {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data as Order[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ admin_status: status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orders"] }); qc.invalidateQueries({ queryKey: ["admin-stats"] }); toast({ title: "Статус оновлено" }); },
    onError: (e: any) => toast({ title: "Помилка", description: e.message, variant: "destructive" }),
  });

  const filtered = useMemo(() => (data ?? []).filter((o) => {
    if (statusFilter !== "all" && o.admin_status !== statusFilter) return false;
    if (deliveryFilter !== "all" && o.delivery_method !== deliveryFilter) return false;
    if (dateFilter) { const d = new Date(o.created_at).toISOString().slice(0, 10); if (d !== dateFilter) return false; }
    return true;
  }), [data, statusFilter, deliveryFilter, dateFilter]);

  const formatPhone = (p: string) => p.replace(/(\d{3})(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5");

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl">Замовлення</h1>
        <p className="text-muted-foreground text-sm mt-1">{filtered.length} замовлень</p>
      </header>

      <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-card border border-border/60">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі статуси</SelectItem>
            {Object.entries(STATUSES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
          <SelectTrigger className="w-[200px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Уся доставка</SelectItem>
            <SelectItem value="novaposhta">Нова Пошта</SelectItem>
            <SelectItem value="mistexpress">MistExpress</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-[180px] rounded-xl" />
        {(statusFilter !== "all" || deliveryFilter !== "all" || dateFilter) && (
          <Button variant="outline" className="rounded-xl" onClick={() => { setStatusFilter("all"); setDeliveryFilter("all"); setDateFilter(""); }}>
            Скинути
          </Button>
        )}
      </div>

      <div className="rounded-2xl bg-card border border-border/60 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>№</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Клієнт</TableHead>
              <TableHead>Контакти</TableHead>
              <TableHead>Сума</TableHead>
              <TableHead>Доставка</TableHead>
              <TableHead>Оплата</TableHead>
              <TableHead className="min-w-[180px]">Статус</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={9} className="text-center py-10 text-muted-foreground">Завантаження…</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={9} className="text-center py-10 text-muted-foreground">Замовлень не знайдено</TableCell></TableRow>
            ) : filtered.map((o) => {
              const items = Array.isArray(o.items) ? o.items : [];
              const isExpanded = expandedId === o.id;
              const phone = o.customer_phone?.replace(/\D/g, "");
              return (
                <>
                  <TableRow key={o.id} className={isExpanded ? "bg-secondary/30" : ""}>
                    <TableCell className="font-mono text-xs">{o.order_reference}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      {new Date(o.created_at).toLocaleString("uk-UA", { dateStyle: "short", timeStyle: "short" })}
                    </TableCell>
                    <TableCell className="font-light">{o.customer_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <a href={`tel:${phone}`} className="text-xs text-muted-foreground hover:text-primary whitespace-nowrap">{o.customer_phone}</a>
                        <a href={`tel:${phone}`} className="grid h-7 w-7 place-items-center rounded-lg bg-secondary hover:bg-primary hover:text-white transition-colors" title="Зателефонувати">
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                        <a href={`https://t.me/+${phone}`} target="_blank" rel="noopener noreferrer" className="grid h-7 w-7 place-items-center rounded-lg bg-[#229ED9]/10 hover:bg-[#229ED9] hover:text-white text-[#229ED9] transition-colors" title="Telegram">
                          <MessageCircle className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{formatUAH(Number(o.amount))}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {o.delivery_method === "novaposhta" ? "Нова Пошта" : o.delivery_method === "mistexpress" ? "MistExpress" : "—"}
                      {o.delivery_city && <div className="text-xs text-muted-foreground">{o.delivery_city}, {o.delivery_branch}</div>}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
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
                              <span className="inline-flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${v.dot}`} />{v.label}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setExpandedId(isExpanded ? null : o.id)}>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded row — order details */}
                  {isExpanded && (
                    <TableRow key={`${o.id}-detail`} className="bg-secondary/20">
                      <TableCell colSpan={9} className="py-4 px-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Товари</p>
                            <div className="space-y-2">
                              {items.length === 0 ? <p className="text-sm text-muted-foreground">—</p> : items.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-border/40 last:border-0">
                                  <div className="flex items-center gap-3">
                                    {item.image && <img src={item.image} alt={item.name} className="h-10 w-10 object-contain rounded-lg bg-white" />}
                                    <span className="text-sm font-light">{item.name}</span>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-sm font-medium">{formatUAH(item.price * item.quantity)}</p>
                                    <p className="text-xs text-muted-foreground">{formatUAH(item.price)} × {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Деталі</p>
                            {o.customer_email && <p className="text-sm"><span className="text-muted-foreground">Email: </span>{o.customer_email}</p>}
                            <p className="text-sm"><span className="text-muted-foreground">Місто: </span>{o.delivery_city || "—"}</p>
                            <p className="text-sm"><span className="text-muted-foreground">Відділення: </span>{o.delivery_branch || "—"}</p>
                            <p className="text-sm font-medium">Разом: {formatUAH(Number(o.amount))}</p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
