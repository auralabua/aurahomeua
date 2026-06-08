import { useState, useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle, ThumbsUp } from "lucide-react";
import { siteReviews, trustStats } from "@/data/reviews";

const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => {
  const sz = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${sz} ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
      ))}
    </div>
  );
};

export const ReviewsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getCardWidth = () => {
    const card = scrollRef.current?.querySelector("article");
    return card ? card.offsetWidth + 16 : 300;
  };

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, siteReviews.length - 1));
    setActiveIdx(clamped);
    scrollRef.current?.scrollTo({ left: clamped * getCardWidth(), behavior: "smooth" });
  };

  const startAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % siteReviews.length;
        scrollRef.current?.scrollTo({ left: next * getCardWidth(), behavior: "smooth" });
        return next;
      });
    }, 5000);
  };

  useEffect(() => {
    startAuto();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Sync dot indicator on touch/swipe scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const cw = getCardWidth();
        if (cw > 0) setActiveIdx(Math.round(el.scrollLeft / cw));
      }, 80);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); clearTimeout(t); };
  }, []);

  const nav = (dir: "left" | "right") => {
    const next =
      dir === "right"
        ? (activeIdx + 1) % siteReviews.length
        : (activeIdx - 1 + siteReviews.length) % siteReviews.length;
    goTo(next);
    startAuto();
  };

  const avgRating = (siteReviews.reduce((a, r) => a + r.rating, 0) / siteReviews.length).toFixed(1);

  return (
    <section className="bg-secondary/40 py-12 sm:py-20">
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "BodyHome",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: avgRating,
              reviewCount: siteReviews.length,
              bestRating: "5",
              worstRating: "1",
            },
            review: siteReviews.map(r => ({
              "@type": "Review",
              author: { "@type": "Person", name: r.name },
              datePublished: r.date,
              reviewBody: r.text,
              reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: "5" },
            })),
          }),
        }}
      />

      <div className="container">
        {/* Header row */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="aura-kicker mb-2">відгуки клієнтів</p>
            <h2 className="text-2xl sm:text-3xl font-light">Що кажуть покупці</h2>
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={5} size="md" />
              <span className="text-xl font-semibold text-foreground">{avgRating}</span>
              <span className="text-sm text-muted-foreground font-light">з {siteReviews.length} відгуків</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => nav("left")}
              aria-label="Попередній відгук"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => nav("right")}
              aria-label="Наступний відгук"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white hover:bg-primary hover:text-white hover:border-primary transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Trust stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {trustStats.map((s, i) => (
            <div key={i} className="rounded-2xl bg-white border border-border/40 py-3 px-4 text-center">
              <p className="text-2xl font-light text-primary">{s.number}</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-light">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollSnapType: "x mandatory",
          }}
        >
          {siteReviews.map(review => (
            <article
              key={review.id}
              className="shrink-0 w-full sm:w-[calc(50%-8px)] flex flex-col rounded-2xl border border-border/40 bg-white p-4"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Avatar + name + badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-foreground/80"
                    style={{ backgroundColor: review.avatarBg }}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.city}</p>
                  </div>
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-0.5 shrink-0 ml-2">
                    <CheckCircle className="h-2.5 w-2.5 text-green-600" />
                    <span className="text-[10px] text-green-700 font-medium">Верифіковано</span>
                  </div>
                )}
              </div>

              <StarRating rating={review.rating} />

              <p className="mt-2.5 text-sm font-light leading-relaxed text-foreground/80 line-clamp-3">
                "{review.text}"
              </p>

              {review.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {review.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-foreground/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer: product image + info + thumbs */}
              <div className="mt-3 pt-3 border-t border-border/40 flex items-center gap-3">
                {review.imageUrl && (
                  <div className="shrink-0 w-12 h-12 rounded-lg border border-border/30 bg-white overflow-hidden flex items-center justify-center">
                    <img
                      src={review.imageUrl}
                      alt={review.product}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-tight">
                    {review.productCategory}
                  </p>
                  <p className="text-xs font-medium text-foreground line-clamp-1">{review.product}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{review.date}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{review.helpful}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {siteReviews.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); startAuto(); }}
              aria-label={`Відгук ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === activeIdx ? "w-6 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
