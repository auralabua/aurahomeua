import { useState, useMemo } from "react";
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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { DBProduct, DBCategory } from "@/hooks/useShopData";

const PAGE_SIZE = 50;

interface FormState {
  id?: string;
  name: string;
  description: string;
  price: string;
  original_price: string;
  category_id: string;
  imagesText: string;
  available: boolean;
  stock: string;
  badge: string;
  vendor_code: string;
  rating: string;
  reviews: string;
}

const empty: FormState = {
  name: "",
  description: "",
  price: "0",
  original_price: "",
  category_id: "",
  imagesText: "",
  available: true,
  stock: "0",
  badge: "none",
  vendor_code: "",
  rating: "",
  reviews: "0",
};

const AdminProducts = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availFilter, setAvailFilter] = useState("all");
  const [sortKey, setSortKey] = useState<"name" | "price" | "stock" | "created_at">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [open, setOpen] = useState(false);

  const productsQ = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5000);
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
        original_price: f.original_price ? Number(f.original_price) : null,
        category_id: f.category_id || null,
        images: f.imagesText.split(/\n+/).map(s => s.trim()).filter(Boolean),
        available: f.available,
        stock: Number(f.stock) || 0,
        badge: f.badge && f.badge !== "none" ? f.badge : null,
        vendor_code: f.vendor_code.trim() || null,
        rating: f.rating ? Number(f.rating) : null,
        reviews: Number(f.reviews) || 0,
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

  const catNameById = useMemo(
    () => new Map((catsQ.data ?? []).map(c => [c.id, c.name])),
    [catsQ.data],
  );

  const filtered = useMemo(() => {
    let rows = productsQ.data ?? [];
    if (search) rows = rows.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.vendor_code ?? "").toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter !== "all") rows = rows.filter(p => p.category_id === categoryFilter);
    if (availFilter === "yes") rows = rows.filter(p => p.available);
    if (availFilter === "no") rows = rows.filter(p => !p.available);
    rows = [...rows].sort((a, b) => {
      let v = 0;
      if (sortKey === "name") v = a.name.localeCompare(b.name, "uk");
      else if (sortKey === "price") v = Number(a.price) - Number(b.price);
      else if (sortKey === "stock") v = (a.stock ?? 0) - (b.stock ?? 0);
      else v = 0;
      return sortDir === "asc" ? v : -v;
    });
    return rows;
  }, [productsQ.data, search, categoryFilter, availFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const openCreate = () => { setEditing({ ...empty }); setOpen(true); };
  const openEdit = (p: DBProduct) => {
    setEditing({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      original_price: p.original_price ? String(p.original_price) : "",
      category_id: p.category_id ?? "",
      imagesText: (p.images ?? []).join("\n"),
      available: p.available,
      stock: String(p.stock),
      badge: p.badge ?? "none",
      vendor_code: p.vendor_code ?? "",
      rating: p.rating != null ? String(p.rating) : "",
      reviews: String(p.reviews ?? 0),
    });
    setOpen(true);
  };

  const SortIcon = ({ k }: { k: typeof sortKey }) =>
    sortKey === k ? <span className="ml-0.5 text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span> : null;

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

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-4 rounded-2xl bg-card border border-border/60">
        <Input
          placeholder="Пошук за назвою або артикулом…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          className="rounded-xl w-[240px]"
        />
        <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setPage(0); }}>
          <SelectTrigger className="w-[180px] rounded-xl"><SelectValue placeholder="Категорія" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі категорії</SelectItem>
            {(catsQ.data ?? []).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={availFilter} onValueChange={v => { setAvailFilter(v); setPage(0); }}>
          <SelectTrigger className="w-[150px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Будь-яка наявність</SelectItem>
            <SelectItem value="yes">В наявності</SelectItem>
            <SelectItem value="no">Відсутні</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortKey} onValueChange={v => { setSortKey(v as typeof sortKey); setPage(0); }}>
          <SelectTrigger className="w-[160px] rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">За датою</SelectItem>
            <SelectItem value="name">За назвою</SelectItem>
            <SelectItem value="price">За ціною</SelectItem>
            <SelectItem value="stock">За складом</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl"
          onClick={() => setSortDir(d => d === "asc" ? "desc" : "asc")}
        >
          {sortDir === "asc" ? "↑ Зростання" : "↓ Спадання"}
        </Button>
      </div>

      <div className="rounded-2xl bg-card border border-border/60 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">Фото</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                Назва <SortIcon k="name" />
              </TableHead>
              <TableHead>Категорія</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("price")}>
                Ціна <SortIcon k="price" />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("stock")}>
                Склад <SortIcon k="stock" />
              </TableHead>
              <TableHead>Наявність</TableHead>
              <TableHead className="w-24 text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsQ.isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Завантаження…</TableCell></TableRow>
            ) : pageRows.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Нічого не знайдено</TableCell></TableRow>
            ) : pageRows.map(p => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-contain bg-secondary" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-secondary" />
                  )}
                </TableCell>
                <TableCell className="max-w-[260px]">
                  <div className="line-clamp-2 text-sm">{p.name}</div>
                  {p.vendor_code && <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{p.vendor_code}</div>}
                  {p.badge && <Badge variant="secondary" className="mt-1 text-xs">{p.badge}</Badge>}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {catNameById.get(p.category_id ?? "") ?? "—"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="font-medium">{formatUAH(Number(p.price))}</div>
                  {p.original_price && p.original_price > p.price && (
                    <div className="text-xs text-muted-foreground line-through">{formatUAH(Number(p.original_price))}</div>
                  )}
                </TableCell>
                <TableCell className="text-sm">{p.stock}</TableCell>
                <TableCell>
                  {p.available ? (
                    <Badge className="bg-success/15 text-success hover:bg-success/15 whitespace-nowrap">В наявності</Badge>
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
                    onClick={() => { if (confirm(`Видалити "${p.name}"?`)) remove.mutate(p.id); }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Сторінка {page + 1} з {totalPages} ({filtered.length} товарів)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = totalPages <= 7 ? i : Math.max(0, Math.min(page - 3, totalPages - 7)) + i;
              return (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="icon"
                  className="rounded-xl h-9 w-9"
                  onClick={() => setPage(p)}
                >
                  {p + 1}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit / Create dialog */}
      <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Редагувати товар" : "Новий товар"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              onSubmit={e => { e.preventDefault(); save.mutate(editing); }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label>Назва *</Label>
                <Input
                  required
                  value={editing.name}
                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Категорія</Label>
                  <Select value={editing.category_id} onValueChange={v => setEditing({ ...editing, category_id: v })}>
                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Оберіть…" /></SelectTrigger>
                    <SelectContent>
                      {(catsQ.data ?? []).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Артикул</Label>
                  <Input
                    value={editing.vendor_code}
                    onChange={e => setEditing({ ...editing, vendor_code: e.target.value })}
                    className="rounded-xl font-mono text-sm"
                    placeholder="SKU-001"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Опис</Label>
                <Textarea
                  rows={4}
                  value={editing.description}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Фото (URL, по одному в рядку)</Label>
                <Textarea
                  rows={3}
                  value={editing.imagesText}
                  onChange={e => setEditing({ ...editing, imagesText: e.target.value })}
                  className="rounded-xl font-mono text-xs"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Ціна, ₴ *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={editing.price}
                    onChange={e => setEditing({ ...editing, price: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Стара ціна, ₴</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={editing.original_price}
                    onChange={e => setEditing({ ...editing, original_price: e.target.value })}
                    className="rounded-xl"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Склад (шт.)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={editing.stock}
                    onChange={e => setEditing({ ...editing, stock: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Рейтинг (0–5)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={editing.rating}
                    onChange={e => setEditing({ ...editing, rating: e.target.value })}
                    className="rounded-xl"
                    placeholder="4.8"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Відгуків</Label>
                  <Input
                    type="number"
                    min="0"
                    value={editing.reviews}
                    onChange={e => setEditing({ ...editing, reviews: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Бейдж</Label>
                  <Select value={editing.badge} onValueChange={v => setEditing({ ...editing, badge: v })}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без бейджу</SelectItem>
                      <SelectItem value="Хіт продажів">Хіт продажів</SelectItem>
                      <SelectItem value="Новинка">Новинка</SelectItem>
                      <SelectItem value="Акція">Акція</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <Switch
                    checked={editing.available}
                    onCheckedChange={v => setEditing({ ...editing, available: v })}
                    id="avail"
                  />
                  <Label htmlFor="avail" className="cursor-pointer">В наявності</Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full">
                  Скасувати
                </Button>
                <Button type="submit" disabled={save.isPending} className="rounded-full btn-caramel border-0">
                  {save.isPending ? "…" : "Зберегти"}
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
