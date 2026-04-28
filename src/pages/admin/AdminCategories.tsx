import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { DBCategory } from "@/hooks/useShopData";

const slugify = (s: string) =>
  s.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "category";

interface Form {
  id?: string;
  name: string;
  slug: string;
  description: string;
}

const AdminCategories = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Form | null>(null);

  const { data, isLoading } = useQuery({
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
      };
      if (f.id) {
        const { error } = await supabase.from("categories").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(payload);
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

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl">Категорії</h1>
          <p className="text-muted-foreground text-sm mt-1">{data?.length ?? 0} категорій</p>
        </div>
        <Button
          onClick={() => { setEditing({ name: "", slug: "", description: "" }); setOpen(true); }}
          className="rounded-full btn-caramel border-0"
        >
          <Plus className="h-4 w-4 mr-1" /> Додати категорію
        </Button>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="text-muted-foreground">Завантаження…</div>
        ) : (data ?? []).map((c) => (
          <div key={c.id} className="p-5 rounded-2xl bg-card border border-border/60 shadow-soft">
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-muted-foreground font-mono mt-1">{c.slug}</div>
            {c.description && <p className="text-sm text-muted-foreground mt-2">{c.description}</p>}
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="rounded-full" onClick={() => { setEditing({ id: c.id, name: c.name, slug: c.slug, description: c.description ?? "" }); setOpen(true); }}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Перейменувати
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Видалити "${c.name}"?`)) remove.mutate(c.id); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Редагувати категорію" : "Нова категорія"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(editing); }} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Назва</Label>
                <Input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label>Slug</Label>
                <Input required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="rounded-xl font-mono text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label>Опис</Label>
                <Input value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="rounded-xl" />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full">Скасувати</Button>
                <Button type="submit" disabled={save.isPending} className="rounded-full btn-caramel border-0">Зберегти</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
