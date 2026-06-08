import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type SupportRequest = {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: "new" | "in_progress" | "resolved";
  created_at: string;
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  new:         { label: "Нове",       className: "bg-blue-50 text-blue-700 border-blue-200" },
  in_progress: { label: "В роботі",   className: "bg-amber-50 text-amber-700 border-amber-200" },
  resolved:    { label: "Вирішено",   className: "bg-green-50 text-green-700 border-green-200" },
};

const NEXT_STATUS: Record<string, string> = {
  new: "in_progress",
  in_progress: "resolved",
  resolved: "new",
};

const FILTER_OPTIONS = [
  { value: "all",         label: "Всі" },
  { value: "new",         label: "Нові" },
  { value: "in_progress", label: "В роботі" },
  { value: "resolved",    label: "Вирішені" },
];

const AdminSupport = () => {
  const [filter, setFilter] = useState("all");
  const qc = useQueryClient();

  const { data: requests = [], isLoading } = useQuery<SupportRequest[]>({
    queryKey: ["support_requests"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("support_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await (supabase as any)
        .from("support_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["support_requests"] });
      toast({ title: "Статус оновлено" });
    },
  });

  const filtered = filter === "all" ? requests : requests.filter(r => r.status === filter);

  const newCount = requests.filter(r => r.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Підтримка</h1>
          {newCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
              {newCount} нових
            </span>
          )}
        </div>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ["support_requests"] })}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-secondary transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Оновити
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === opt.value
                ? "bg-primary text-white"
                : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {opt.label}
            {opt.value !== "all" && (
              <span className="ml-1.5 opacity-70">
                ({requests.filter(r => r.status === opt.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <MessageCircle className="h-10 w-10 opacity-30" />
          <p className="text-sm">Звернень немає</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-secondary/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Клієнт</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Телефон</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Повідомлення</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Дата</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filtered.map(req => (
                  <tr key={req.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{req.name}</td>
                    <td className="px-4 py-3">
                      <a href={`tel:${req.phone}`} className="text-primary hover:underline">
                        {req.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="line-clamp-2 text-muted-foreground">{req.message}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(req.created_at).toLocaleString("uk-UA", {
                        day: "2-digit", month: "2-digit", year: "2-digit",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => updateStatus.mutate({ id: req.id, status: NEXT_STATUS[req.status] })}
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-70 ${
                          STATUS_LABELS[req.status]?.className ?? ""
                        }`}
                      >
                        {STATUS_LABELS[req.status]?.label ?? req.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border/40">
            {filtered.map(req => (
              <div key={req.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">{req.name}</p>
                    <a href={`tel:${req.phone}`} className="text-xs text-primary hover:underline">
                      {req.phone}
                    </a>
                  </div>
                  <button
                    onClick={() => updateStatus.mutate({ id: req.id, status: NEXT_STATUS[req.status] })}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium shrink-0 ${
                      STATUS_LABELS[req.status]?.className ?? ""
                    }`}
                  >
                    {STATUS_LABELS[req.status]?.label ?? req.status}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">{req.message}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(req.created_at).toLocaleString("uk-UA", {
                    day: "2-digit", month: "2-digit", year: "2-digit",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
