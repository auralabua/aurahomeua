import { useEffect, useState } from "react";
import { Star, MessageSquarePlus, Loader2 } from "lucide-react";
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
  created_at: string;
}

const reviewSchema = z.object({
  author_name: z.string().trim().min(1, "Вкажіть ім'я").max(80, "Ім'я задовге"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3, "Відгук закороткий").max(1000, "Відгук задовгий"),
});

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric" });

export const ProductReviews = ({ productId }: { productId: string }) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("id, author_name, rating, comment, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = reviewSchema.safeParse({ author_name: author, rating, comment });
    if (!parsed.success) {
      toast({
        title: "Перевірте форму",
        description: parsed.error.errors[0]?.message ?? "Невірні дані",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert([
      { product_id: productId, ...parsed.data },
    ]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Не вдалося опублікувати", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Дякуємо за відгук!", description: "Ваш відгук опубліковано." });
    setAuthor("");
    setRating(5);
    setComment("");
    setShowForm(false);
    load();
  };

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="text-2xl md:text-3xl">Відгуки {reviews.length > 0 && <span className="text-muted-foreground text-xl">({reviews.length})</span>}</h2>
        <Button
          variant={showForm ? "outline" : "default"}
          onClick={() => setShowForm(v => !v)}
          className="rounded-full"
        >
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          {showForm ? "Скасувати" : "Залишити відгук"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-2xl bg-secondary/50 border border-border space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Ваше ім'я</label>
            <Input
              value={author}
              onChange={e => setAuthor(e.target.value)}
              maxLength={80}
              placeholder="Як вас звати?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Оцінка</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                  className="p-1 transition-transform hover:scale-110"
                  aria-label={`${i} зірок`}
                >
                  <Star
                    className={`h-7 w-7 ${
                      i <= (hoverRating || rating) ? "fill-warning text-warning" : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Відгук</label>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Поділіться враженнями про товар…"
              required
            />
            <div className="text-xs text-muted-foreground mt-1 text-right">{comment.length}/1000</div>
          </div>

          <Button type="submit" disabled={submitting} className="rounded-full">
            {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Опублікувати
          </Button>
        </form>
      )}

      {loading ? (
        <div className="text-center text-muted-foreground py-8">Завантаження відгуків…</div>
      ) : reviews.length === 0 ? (
        <div className="text-center text-muted-foreground py-8 rounded-2xl bg-secondary/30">
          Поки що немає відгуків. Будьте першим!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => (
            <article key={r.id} className="p-5 rounded-2xl bg-card border border-border shadow-soft">
              <header className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-soft text-primary grid place-items-center font-semibold">
                    {r.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{r.author_name}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(r.created_at)}</div>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i <= r.rating ? "fill-warning text-warning" : "text-muted"}`}
                    />
                  ))}
                </div>
              </header>
              <p className="text-foreground/85 leading-relaxed whitespace-pre-line">{r.comment}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
