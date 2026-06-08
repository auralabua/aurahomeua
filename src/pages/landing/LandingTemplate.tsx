import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useSEO } from "@/hooks/useSEO";
import { useProductsAsLegacy } from "@/hooks/useShopData";

export interface BenefitItem {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  desc: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface LandingConfig {
  path: string;
  title: string;
  h1: string;
  breadcrumbLabel: string;
  description: string;
  keywords: string;
  intro: string;
  benefits: BenefitItem[];
  categorySlugs: string[];
  catalogLink: string;
  faq: FAQItem[];
}

export function LandingTemplate({
  path, title, h1, breadcrumbLabel, description, keywords, intro,
  benefits, categorySlugs, catalogLink, faq,
}: LandingConfig) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { products: allProducts } = useProductsAsLegacy();

  const products = allProducts
    .filter(p => categorySlugs.includes(p.category))
    .slice(0, 12);

  useSEO({
    title,
    description,
    keywords,
    url: path,
    breadcrumbs: [{ name: breadcrumbLabel, url: path }],
    faq,
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-secondary/40 py-10 sm:py-12">
        <div className="container">
          <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Головна</Link>
            <span>/</span>
            <span className="text-foreground">{breadcrumbLabel}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.15] text-foreground mb-4 max-w-3xl">
            {h1}
          </h1>
          <p className="text-base sm:text-lg text-foreground/70 leading-relaxed max-w-2xl">
            {intro}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 bg-white border-b border-border/30">
        <div className="container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <b.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{b.title}</p>
                  <p className="text-xs text-muted-foreground leading-snug mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-10 sm:py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-medium text-foreground">Каталог товарів</h2>
            <Link to={catalogLink} className="text-sm text-primary hover:underline font-medium">
              Всі товари →
            </Link>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} compact />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-secondary/40 animate-pulse" />
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Button asChild size="lg" className="rounded-full btn-aura border-0 px-8">
              <Link to={catalogLink}>Переглянути весь каталог →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 sm:py-12 bg-secondary/40">
        <div className="container max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-medium text-foreground mb-6">Часті питання</h2>
          <div className="space-y-3">
            {faq.map((item, i) => (
              <div key={i} className="rounded-2xl bg-white border border-border/40 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="text-sm sm:text-base font-medium text-foreground">{item.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pt-3 text-sm text-muted-foreground leading-relaxed border-t border-border/20">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-12 bg-white">
        <div className="container text-center max-w-2xl">
          <h2 className="text-2xl font-medium text-foreground mb-3">Потрібна допомога з вибором?</h2>
          <p className="text-foreground/70 mb-6 leading-relaxed">
            Напишіть нам — підберемо потрібний товар під ваш запит і бюджет.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="rounded-full btn-aura border-0 px-8">
              <Link to={catalogLink}>До каталогу</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <a href="https://t.me/BodyHome1" target="_blank" rel="noopener noreferrer">Написати в Telegram</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
