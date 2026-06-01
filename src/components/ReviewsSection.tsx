import { useState, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, CheckCircle, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";
import { siteReviews, trustStats } from "@/data/reviews";

const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => {
  const sz = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`${sz} ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
      ))}
    </div>
  );
};

export const ReviewsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector("article");
    const w = card ? card.offsetWidth + 16 : 340;
    scrollRef.current.scrollBy({ left: dir === "right" ? w : -w, behavior: "smooth" });
    setActiveIdx(i => dir === "right" ? Math.min(i + 1, siteReviews.length - 1) : Math.max(i - 1, 0));
  };

  const avgRating = (siteReviews.reduce((a, r) => a + r.rating, 0) / siteReviews.length).toFixed(1);

  return (
    <section className="bg-secondary/40 py-12 sm:py-20">
      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "BodyHome",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": avgRating,
          "reviewCount": siteReviews.length,
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": siteReviews.map(r => ({
          "@type": "Review",
          "author": { "@type": "Person", "name": r.name },
          "datePublished": r.date,
          "reviewBody": r.text,
          "reviewRating": { "@type": "Rating", "ratingValue": r.rating, "bestRating": "5" }
        }))
      })}} />

      <div className="container">
        {/* Header */}
        <div className="mb-8 sm:mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="aura-kicker mb-3">відгуки клієнтів</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light">Що кажуть покупці</h2>
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={5} size="md" />
              <span className="text-2xl font-semibold text-foreground">{avgRating}</span>
              <span className="text-sm text-muted-foreground font-light">з {siteReviews.length} відгуків</span>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white hover:bg-primary hover:text-white hover:border-primary transition-all">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white hover:bg-primary hover:text-white hover:border-primary transition-all">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Trust stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {trustStats.map((s, i) => (
            <div key={i} className="rounded-2xl bg-white border border-border/40 p-4 text-center">
              <p className="text-2xl sm:text-3xl font-light text-primary">{s.number}</p>
              <p className="text-xs text-muted-foreground mt-1 font-light">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Reviews carousel */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {siteReviews.map((review) => (
              <article
                key={review.id}
                className="shrink-0 w-[300px] sm:w-[340px] flex flex-col rounded-2xl border border-border/40 bg-white p-5 sm:p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-foreground/80"
                      style={{ backgroundColor: review.avatarBg }}
                    >
                      {review.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.city}</p>
                    </div>
                  </div>
                  {review.verified && (
                    <div className="flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2 py-0.5">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-[10px] text-green-700 font-medium">Верифіковано</span>
                    </div>
                  )}
                </div>

                <StarRating rating={review.rating} />

                <p className="mt-3 text-sm font-light leading-relaxed text-foreground/80 flex-1">
                  "{review.text}"
                </p>

                {/* Tags */}
                {review.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {review.tags.map((tag, i) => (
                      <span key={i} className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-foreground/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{review.productCategory}</p>
                    <p className="text-xs font-medium text-foreground line-clamp-1">{review.product}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{review.helpful}</span>
                  </div>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">{review.date}</p>
              </article>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-4 sm:hidden">
            {siteReviews.map((_, i) => (
              <button key={i} onClick={() => {
                setActiveIdx(i);
                if (scrollRef.current) {
                  const card = scrollRef.current.querySelector("article");
                  const w = card ? card.offsetWidth + 16 : 316;
                  scrollRef.current.scrollTo({ left: i * w, behavior: "smooth" });
                }
              }}
                className={`h-1.5 rounded-full transition-all ${i === activeIdx ? "w-4 bg-primary" : "w-1.5 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
