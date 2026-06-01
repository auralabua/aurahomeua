import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { DBCategory } from "@/hooks/useShopData";

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "category";

interface Form {
  id?: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string;
}

const AdminCategories = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Form | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const { data: cats, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("position");
      if (error) throw error;
      return data as DBCategory[];
    },
  });

  const save = useMutation({
    mutationFn: async (f: Form) => {
      const payload = {
        name: f.name.trim(),
        slug: f.slug.trim() || slugify(f.name),
        description: f.description.trim() || null,
        parent_id: f.parent_id || null,
      };
      if (f.id) {
        const { error } = await supabase.from("categories").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const maxPos = Math.max(0, ...(cats ?? []).filter(c => !c.parent_id).map(c => c.position));
        const { error } = await supabase.from("categories").insert({ ...payload, position: maxPos + 1 });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Збережено" });
      setOpen(false);
    },
    onError: (e: any) => toast({ title: "Помилка", description: e.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Видалено" });
    },
    onError: (e: any) => toast({ title: "Помилка", description: e.message, variant: "destructive" }),
  });

  const reorder = useMutation({
    mutationFn: async ({ id, direction, siblings }: { id: string; direction: "up" | "down"; siblings: DBCategory[] }) => {
      const idx = siblings.findIndex(c => c.id === id);
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= siblings.length) return;
      const a = siblings[idx];
      const b = siblings[swapIdx];
      const { error } = await supabase.rpc("swap_category_positions", {
        id_a: a.id, pos_a: b.position,
        id_b: b.id, pos_b: a.position,
      }).then(r => r);
      if (error) {
        // Fallback: update individually
        const r1 = await supabase.from("categories").update({ position: b.position }).eq("id", a.id);
        const r2 = await supabase.from("categories").update({ position: a.position }).eq("id", b.id);
        if (r1.error) throw r1.error;
        if (r2.error) throw r2.error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-categories"] }),
    onError: (e: any) => toast({ title: "Помилка", description: e.message, variant: "destructive" }),
  });

  const { roots, childrenOf } = useMemo(() => {
    const all = cats ?? [];
    const roots = all.filter(c => !c.parent_id);
    const childrenOf: Record<string, DBCategory[]> = {};
    all.filter(c => c.parent_id).forEach(c => {
      if (!childrenOf[c.parent_id!]) childrenOf[c.parent_id!] = [];
      childrenOf[c.parent_id!].push(c);
    });
    return { roots, childrenOf };
  }, [cats]);

  const openCreate = (parentId?: string) => {
    setEditing({ name: "", slug: "", description: "", parent_id: parentId ?? "" });
    setOpen(true);
  };
  const openEdit = (c: DBCategory) => {
    setEditing({ id: c.id, name: c.name, slug: c.slug, description: c.description ?? "", parent_id: c.parent_id ?? "" });
    setOpen(true);
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const CategoryRow = ({ cat, siblings, depth = 0 }: { cat: DBCategory; siblings: DBCategory[]; depth?: number }) => {
    const children = childrenOf[cat.id] ?? [];
    const hasChildren = children.length > 0;
    const isExpanded = expanded.has(cat.id);
    const idx = siblings.indexOf(cat);

    return (
      <>
        <div
          className={`flex items-center gap-2 px-3 py-3 rounded-xl border border-border/40 bg-card hover:border-primary/20 transition-colors ${depth > 0 ? "ml-6 mt-1" : "mt-2"}`}
        >
          {/* Expand toggle */}
          <button
            type="button"
            onClick={() => hasChildren && toggleExpand(cat.id)}
            className={`shrink-0 grid h-6 w-6 place-items-center rounded-lg transition-colors ${hasChildren ? "hover:bg-secondary cursor-pointer" : "opacity-0"}`}
          >
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </button>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{cat.name}</span>
              {children.length > 0 && (
                <span className="text-[10px] bg-secondary rounded-full px-2 py-0.5 text-muted-foreground">
                  {children.length} підкатегорій
                </span>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{cat.slug}</div>
          </div>

          {/* Position */}
          <span className="text-[11px] text-muted-foreground w-6 text-center">{cat.position}</span>

          {/* Reorder */}
          <div className="flex gap-0.5 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-lg"
              disabled={idx === 0}
              onClick={() => reorder.mutate({ id: cat.id, direction: "up", siblings })}
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-lg"
              disabled={idx === siblings.length - 1}
              onClick={() => reorder.mutate({ id: cat.id, direction: "down", siblings })}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-1 shrink-0">
            {depth === 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 rounded-lg text-xs text-muted-foreground hover:text-primary"
                onClick={() => openCreate(cat.id)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Підкат.
              </Button>
            )}
            <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg" onClick={() => openEdit(cat)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-lg"
              onClick={() => {
                if (confirm(`Видалити "${cat.name}"? Це також видалить усі підкатегорії.`)) {
                  remove.mutate(cat.id);
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        </div>

        {/* Children */}
        {isExpanded && children.map(child => (
          <CategoryRow key={child.id} cat={child} siblings={children} depth={depth + 1} />
        ))}
      </>
    );
  };

  const rootParentOptions = (cats ?? []).filter(c => !c.parent_id);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl">Категорії</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {roots.length} основних · {(cats ?? []).filter(c => c.parent_id).length} підкатегорій
          </p>
        </div>
        <Button onClick={() => openCreate()} className="rounded-full btn-caramel border-0">
          <Plus className="h-4 w-4 mr-1" /> Додати категорію
        </Button>
      </header>

      <div className="rounded-2xl bg-card border border-border/60 p-4">
        {isLoading ? (
          <div className="text-muted-foreground py-8 text-center">Завантаження…</div>
        ) : roots.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">Категорій немає</div>
        ) : (
          <div>
            {roots.map(cat => (
              <CategoryRow key={cat.id} cat={cat} siblings={roots} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Редагувати категорію" : "Нова категорія"}</DialogTitle>
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
                  onChange={e => setEditing({
                    ...editing,
                    name: e.target.value,
                    slug: editing.id ? editing.slug : slugify(e.target.value),
                  })}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input
                  required
                  value={editing.slug}
                  onChange={e => setEditing({ ...editing, slug: e.target.value })}
                  className="rounded-xl font-mono text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Батьківська категорія</Label>
                <Select
                  value={editing.parent_id || "none"}
                  onValueChange={v => setEditing({ ...editing, parent_id: v === "none" ? "" : v })}
                >
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Без батьківської (корінь)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Основна категорія —</SelectItem>
                    {rootParentOptions
                      .filter(c => c.id !== editing.id)
                      .map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)
                    }
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Опис</Label>
                <Input
                  value={editing.description}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  className="rounded-xl"
                />
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

export default AdminCategories;
