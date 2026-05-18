import { useEffect, useState } from "react";
import { Star, MessageSquarePlus, Loader2, ThumbsUp, BadgeCheck } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  author_name: string;
  rating: number;
  comment: string;
  city?: string;
  verified?: boolean;
  created_at: string;
}

const reviewSchema = z.object({
  author_name: z.string().trim().min(2, "Вкажіть ім'я").max(80),
  city: z.string().trim().max(50).optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10, "Напишіть хоча б кілька слів").max(1000),
});

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric" });

const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} className={`${size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5"} ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
    ))}
  </div>
);

const RatingBar = ({ label, value, total }: { label: string; value: number; total: number }) => (
  <div className="flex items-center gap-3 text-sm">
    <span className="w-16 text-muted-foreground">{label}</span>
    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
      <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: total ? `${(value / total) * 100}%` : "0%" }} />
    </div>
    <span className="w-6 text-right text-muted-foreground text-xs">{value}</span>
  </div>
);

export const ProductReviews = ({ productId }: { productId: string }) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ author_name: "", city: "", comment: "" });
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("id, author_name, rating, comment, city, verified, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewSchema.safeParse({ ...form, rating });
    if (!parsed.success) {
      toast({ title: "Перевірте форму", description: parsed.error.errors[0]?.message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert([{
      product_id: productId,
      author_name: parsed.data.author_name,
      city: parsed.data.city || null,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    }]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Помилка", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Дякуємо за відгук! ✅", description: "Ваш відгук опубліковано." });
    setForm({ author_name: "", city: "", comment: "" });
    setRating(5);
    setShowForm(false);
    load();
  };

  // Статистика
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
  const dist = [5, 4, 3, 2, 1].map(n => ({ label: `${n} ★`, value: reviews.filter(r => r.rating === n).length }));

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <h2 className="text-2xl md:text-3xl font-light">
          Відгуки {reviews.length > 0 && <span className="text-muted-foreground text-xl">({reviews.length})</span>}
        </h2>
        <Button
          variant={showForm ? "outline" : "default"}
          onClick={() => setShowForm(v => !v)}
          className="rounded-full btn-aura border-0 gap-2"
        >
          <MessageSquarePlus className="h-4 w-4" />
          {showForm ? "Скасувати" : "Залишити відгук"}
        </Button>
      </div>

      {/* Зведена статистика */}
      {reviews.length > 0 && (
        <div className="mb-8 p-6 rounded-2xl bg-card border border-border/60 grid sm:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="text-center">
            <div className="text-5xl font-light text-primary">{avg.toFixed(1)}</div>
            <StarRating rating={Math.round(avg)} size="md" />
            <div className="text-xs text-muted-foreground mt-1">{reviews.length} відгуків</div>
          </div>
          <div className="space-y-2">
            {dist.map(d => <RatingBar key={d.label} label={d.label} value={d.value} total={reviews.length} />)}
          </div>
        </div>
      )}

      {/* Форма */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl bg-secondary/40 border border-border space-y-4">
          <h3 className="text-lg font-light mb-2">Ваш відгук</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Ім'я *</label>
              <Input value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} placeholder="Олена К." className="rounded-xl h-11" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Місто</label>
              <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Київ" className="rounded-xl h-11" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Оцінка *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} type="button"
                  onMouseEnter={() => setHoverRating(i)} onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)} className="p-1 transition-transform hover:scale-110">
                  <Star className={`h-8 w-8 transition-colors ${i <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                </button>
              ))}
              <span className="self-center ml-2 text-sm text-muted-foreground">
                {["", "Жахливо", "Погано", "Нормально", "Добре", "Відмінно"][hoverRating || rating]}
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Відгук *</label>
            <Textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })}
              rows={4} placeholder="Розкажіть про свій досвід з товаром…" className="rounded-xl resize-none" required />
            <div className="text-xs text-muted-foreground text-right">{form.comment.length}/1000</div>
          </div>
          <Button type="submit" disabled={submitting} className="rounded-full btn-aura border-0 gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Опублікувати відгук
          </Button>
        </form>
      )}

      {/* Список відгуків */}
      {loading ? (
        <div className="text-center text-muted-foreground py-12 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Завантаження…
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-border">
          <Star className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-light">Поки немає відгуків. Будьте першим!</p>
          <Button variant="outline" className="mt-4 rounded-full" onClick={() => setShowForm(true)}>
            Написати відгук
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <article key={r.id} className="p-5 rounded-2xl bg-card border border-border/60">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center font-medium text-sm shrink-0">
                    {r.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-light text-sm">
                      {r.author_name}
                      {r.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.city && `${r.city} · `}{formatDate(r.created_at)}
                    </div>
                  </div>
                </div>
                <StarRating rating={r.rating} />
              </div>
              <p className="text-sm font-light leading-relaxed text-foreground/80 whitespace-pre-line">{r.comment}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
