import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatUAH } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { DBProduct, DBCategory } from "@/hooks/useShopData";

interface FormState {
  id?: string;
  name: string;
  description: string;
  price: string;
  category_id: string;
  imagesText: string;
  available: boolean;
  stock: string;
  badge: string;
}

const empty: FormState = {
  name: "",
  description: "",
  price: "0",
  category_id: "",
  imagesText: "",
  available: true,
  stock: "0",
  badge: "none",
};

const AdminProducts = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<FormState | null>(null);
  const [open, setOpen] = useState(false);

  const productsQ = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2000);
      if (error) throw error;
      return data as DBProduct[];
    },
  });

  const catsQ = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("position");
      if (error) throw error;
      return data as DBCategory[];
    },
  });

  const save = useMutation({
    mutationFn: async (f: FormState) => {
      const payload = {
        name: f.name.trim(),
        description: f.description.trim() || null,
        price: Number(f.price) || 0,
        category_id: f.category_id || null,
        images: f.imagesText.split(/\n+/).map((s) => s.trim()).filter(Boolean),
        available: f.available,
        stock: Number(f.stock) || 0,
        badge: f.badge && f.badge !== "none" ? f.badge : null,
      };
      if (f.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({ title: "Збережено" });
      setOpen(false);
      setEditing(null);
    },
    onError: (e: any) => toast({ title: "Помилка", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Видалено" });
    },
    onError: (e: any) => toast({ title: "Помилка", description: e.message, variant: "destructive" }),
  });

  const filtered = (productsQ.data ?? []).filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => { setEditing({ ...empty }); setOpen(true); };
  const openEdit = (p: DBProduct) => {
    setEditing({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      category_id: p.category_id ?? "",
      imagesText: (p.images ?? []).join("\n"),
      available: p.available,
      stock: String(p.stock),
      badge: p.badge ?? "none",
    });
    setOpen(true);
  };

  const catNameById = new Map((catsQ.data ?? []).map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl">Товари</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} з {productsQ.data?.length ?? 0}</p>
        </div>
        <Button onClick={openCreate} className="rounded-full btn-caramel border-0">
          <Plus className="h-4 w-4 mr-1" /> Додати товар
        </Button>
      </header>

      <Input
        placeholder="Пошук за назвою…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-xl max-w-sm"
      />

      <div className="rounded-2xl bg-card border border-border/60 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Фото</TableHead>
              <TableHead>Назва</TableHead>
              <TableHead>Категорія</TableHead>
              <TableHead>Ціна</TableHead>
              <TableHead>Наявність</TableHead>
              <TableHead className="w-32 text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsQ.isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Завантаження…</TableCell></TableRow>
            ) : filtered.slice(0, 200).map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-contain bg-secondary" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-secondary" />
                  )}
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <div className="line-clamp-2 text-sm">{p.name}</div>
                  {p.badge && <Badge variant="secondary" className="mt-1 text-xs">{p.badge}</Badge>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {catNameById.get(p.category_id ?? "") ?? "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium">{formatUAH(Number(p.price))}</TableCell>
                <TableCell>
                  {p.available ? (
                    <Badge className="bg-success/15 text-success hover:bg-success/15">В наявності</Badge>
                  ) : (
                    <Badge variant="secondary">Немає</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      if (confirm(`Видалити "${p.name}"?`)) remove.mutate(p.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length > 200 && (
          <div className="text-center text-xs text-muted-foreground py-3">
            Показано перші 200 з {filtered.length}. Уточніть пошук.
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Редагувати товар" : "Новий товар"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label>Назва</Label>
                <Input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Категорія</Label>
                <Select value={editing.category_id} onValueChange={(v) => setEditing({ ...editing, category_id: v })}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Оберіть…" /></SelectTrigger>
                  <SelectContent>
                    {(catsQ.data ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Опис</Label>
                <Textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Фото (URL, по одному в рядку)</Label>
                <Textarea rows={3} value={editing.imagesText} onChange={(e) => setEditing({ ...editing, imagesText: e.target.value })} className="rounded-xl font-mono text-xs" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Ціна, ₴</Label>
                  <Input type="number" min="0" step="1" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label>Кількість на складі</Label>
                  <Input type="number" min="0" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} className="rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Бейдж</Label>
                  <Select value={editing.badge} onValueChange={(v) => setEditing({ ...editing, badge: v })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без бейджу</SelectItem>
                      <SelectItem value="Хіт продажів">Хіт продажів</SelectItem>
                      <SelectItem value="Новинка">Новинка</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <Switch checked={editing.available} onCheckedChange={(v) => setEditing({ ...editing, available: v })} id="available" />
                  <Label htmlFor="available" className="cursor-pointer">В наявності</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full">Скасувати</Button>
                <Button type="submit" disabled={save.isPending} className="rounded-full btn-caramel border-0">
                  {save.isPending ? "..." : "Зберегти"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
