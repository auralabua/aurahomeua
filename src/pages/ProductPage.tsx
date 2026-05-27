import { useState, useMemo, useCallback } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Truck, ShieldCheck, RotateCcw, Check, Tag } from "lucide-react";
import { formatUAH } from "@/data/products";
import { useProductsAsLegacy, useAllProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { useSEO } from "@/hooks/useSEO";
import type { Product } from "@/data/products";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"];

const SAMPLE_REVIEWS = [
  { name: "Ольга Ткаченко", date: "3 дні тому", text: "Якісний товар, повністю відповідає опису. Доставка швидка, пакування надійне. Вже користуюсь другий тиждень — дуже задоволена!", rating: 5 },
  { name: "Андрій Мельник", date: "1 тиждень тому", text: "Гарна якість за свої гроші. Замовляв для батьків — вони задоволені. Єдине — доставка трохи затрималась, але товар прийшов в цілості.", rating: 4 },
  { name: "Марія Коваль", date: "2 тижні тому", text: "Беру вже вдруге. Перший раз подарувала мамі — вона дуже рада. Тепер собі замовила. Рекомендую!", rating: 5 },
  { name: "Василь Гончаренко", date: "3 тижні тому", text: "Все відповідає опису, якість хороша. Швидко надіслали. Буду ще купувати.", rating: 5 },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Build a 150-160 char meta description from product data */
const buildDescription = (
  product: Product,
  categoryName: string | undefined,
  price: number
): string => {
  const base = product.description?.trim();
  // Use first meaningful sentence if description exists
  const firstSentence = base
    ? base.split(/(?<=[.!?])\s+/).find(s => s.length > 30) ?? base.slice(0, 120)
    : null;

  if (firstSentence && firstSentence.length >= 60) {
    // Trim to 155 chars and add price hint
    const trimmed = firstSentence.slice(0, 120).replace(/[,.]?\s*$/, "");
    return `${trimmed}. Купити за ${formatUAH(price)} з доставкою по Україні.`;
  }

  // Fallback: synthetic description
  const cat = categoryName ? `${categoryName.toLowerCase()} ` : "";
  return `${product.name} — ${cat}від BodyHome. Ціна ${formatUAH(price)}, доставка Новою Поштою, оплата при отриманні. Гарантія якості 14 днів.`;
};

/** Build keyword string for product */
const buildKeywords = (
  product: Product,
  categoryName: string | undefined
): string => {
  const terms: string[] = [
    product.name,
    `${product.name} купити`,
    `${product.name} ціна`,
    `${product.name} Україна`,
  ];
  if (categoryName) {
    terms.push(categoryName, `${categoryName} купити`, `${categoryName} Україна`);
  }
  if (product.vendorCode) terms.push(product.vendorCode);
  terms.push("BodyHome", "доставка по Україні", "Нова Пошта");
  return [...new Set(terms)].join(", ");
};

/** Standard FAQ for every product page */
const buildProductFAQ = (
  productName: string,
  price: number,
  available: boolean
) => [
  {
    q: `Скільки коштує ${productName}?`,
    a: `Актуальна ціна ${productName} — ${formatUAH(price)}. Уточнюйте наявність на сайті або у підтримці.`,
  },
  {
    q: "Яка доставка та скільки часу займає?",
    a: "Доставляємо Новою Поштою, Meest та Укрпоштою по всій Україні. Термін доставки 1–3 робочі дні після відправки. Відправка — наступного дня після підтвердження замовлення.",
  },
  {
    q: "Як оплатити замовлення?",
    a: "Оплата при отриманні (накладений платіж) або онлайн карткою через LiqPay, Monobank, ПриватБанк.",
  },
  {
    q: "Чи можна повернути товар?",
    a: "Так, приймаємо повернення протягом 14 днів з дня отримання, якщо товар не використовувався і збережено упаковку. Повернення — Новою Поштою за рахунок покупця.",
  },
  ...(available
    ? []
    : [{ q: "Чи є товар в наявності?", a: "Наразі товар тимчасово відсутній. Залиште заявку — повідомимо про надходження." }]),
];

// ── Reviews tab ──────────────────────────────────────────────────────────────

const ReviewsTab = ({ product }: { product: Product }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const reviews = SAMPLE_REVIEWS.slice(0, Math.min(product.reviews || 0, 2));

  const handleSubmit = () => {
    if (selected > 0 && text.trim()) setSubmitted(true);
  };

  return (
    <div className="space-y-4">
      {reviews.length > 0 ? reviews.map((r, i) => (
        <div key={i} className="rounded-2xl border border-border/40 bg-secondary/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-semibold shrink-0">
              {r.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.date}</p>
            </div>
            <div className="flex gap-0.5 ml-auto">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
              ))}
            </div>
          </div>
          <p className="text-sm text-foreground/75 leading-relaxed">{r.text}</p>
        </div>
      )) : (
        <p className="text-sm text-muted-foreground py-2">Поки немає відгуків. Будьте першим!</p>
      )}

      <div className="border-t border-border pt-4 mt-2">
        <h4 className="text-sm font-medium mb-3">Залишити відгук</h4>
        {submitted ? (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center">
            <p className="text-sm text-green-700 font-medium">✓ Дякуємо за відгук!</p>
            <p className="text-xs text-green-600 mt-1">Він з'явиться після перевірки</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Ваша оцінка:</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s}
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setSelected(s)}
                    className="transition-transform hover:scale-110 active:scale-95">
                    <Star className={`h-7 w-7 transition-colors ${s <= (hovered || selected) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} />
                  </button>
                ))}
              </div>
            </div>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Ваше ім'я"
              className="w-full rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="Напишіть відгук про товар..."
              className="w-full rounded-xl border border-border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              rows={3} />
            <button onClick={handleSubmit} disabled={!selected || !text.trim()}
              className="rounded-full bg-primary text-white px-5 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Відправити відгук
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, isLoading } = useProductsAsLegacy();
  const { products: allProducts } = useAllProductsAsLegacy();
  const { categories } = useCategoriesAsLegacy();
  const { addItem } = useCart();

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "reviews" | "questions">("desc");

  // ── Resolve product data (before any conditional returns so hooks stay stable) ──
  const product      = allProducts.find(p => p.id === id);
  const catalogProd  = products.find(p => p.id === id);
  const foundProduct = product || catalogProd;

  const parentId      = foundProduct?.parentProductId ?? (foundProduct?.isParent ? foundProduct.id : null);
  const parent        = parentId ? allProducts.find(p => p.id === parentId) : null;
  const displayProduct = parent ?? foundProduct;

  const groupId = foundProduct?.xmlGroupId ?? parent?.xmlGroupId;

  // useMemo must be unconditional — always called, guarded internally
  const variants = useMemo(() => {
    if (!groupId && !parentId) return [];
    return allProducts
      .filter(p =>
        (groupId && p.xmlGroupId === groupId) ||
        (!groupId && (p.parentProductId === parentId || p.id === parentId))
      )
      .sort((a, b) => {
        const ai = SIZE_ORDER.indexOf(a.variantLabel ?? "");
        const bi = SIZE_ORDER.indexOf(b.variantLabel ?? "");
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        const na = parseFloat(a.variantLabel ?? "");
        const nb = parseFloat(b.variantLabel ?? "");
        if (!isNaN(na) && !isNaN(nb)) return na - nb;
        return (a.variantLabel ?? "").localeCompare(b.variantLabel ?? "");
      });
  }, [allProducts, groupId, parentId]);

  const selectedVariant  = variants.find(v => v.id === id) ?? (variants.length > 0 ? variants[0] : null);
  const currentProduct   = selectedVariant ?? foundProduct;
  const category         = displayProduct ? categories.find(c => c.id === displayProduct.category) : null;
  const categoryName     = category?.name;

  // Category name lookup for related cards
  const categoryNameById = useMemo(
    () => new Map(categories.map(c => [c.id, c.name])),
    [categories]
  );

  // ── SEO — always called unconditionally ──────────────────────────────────
  const seoDescription = displayProduct && currentProduct
    ? buildDescription(displayProduct, categoryName, currentProduct.price)
    : undefined;

  const seoKeywords = displayProduct
    ? buildKeywords(displayProduct, categoryName)
    : undefined;

  const seoFAQ = displayProduct && currentProduct
    ? buildProductFAQ(displayProduct.name, currentProduct.price, currentProduct.available)
    : undefined;

  const seoAggregateRating =
    currentProduct && currentProduct.reviews > 0
      ? { ratingValue: currentProduct.rating, reviewCount: currentProduct.reviews }
      : undefined;

  const seoBreadcrumbs = displayProduct
    ? [
        { name: "Каталог", url: "/catalog" },
        ...(category ? [{ name: category.name, url: `/catalog?category=${category.id}` }] : []),
        { name: displayProduct.name, url: `/product/${displayProduct.id}` },
      ]
    : undefined;

  useSEO({
    title:             displayProduct?.name,
    description:       seoDescription,
    keywords:          seoKeywords,
    image:             displayProduct?.images?.[0],
    images:            displayProduct?.images,
    url:               displayProduct ? `/product/${displayProduct.id}` : "/catalog",
    type:              "product",
    price:             currentProduct?.price,
    originalPrice:     currentProduct?.originalPrice,
    availability:      currentProduct?.available ?? true,
    sku:               currentProduct?.vendorCode,
    aggregateRating:   seoAggregateRating,
    breadcrumbs:       seoBreadcrumbs,
    faq:               seoFAQ,
  });

  // ── Early returns (AFTER all hooks) ─────────────────────────────────────
  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (!foundProduct) return <Navigate to="/catalog" replace />;

  // ── Derived values ───────────────────────────────────────────────────────
  const related = products
    .filter(p => p.category === displayProduct!.category && p.id !== displayProduct!.id)
    .slice(0, 4);

  const images      = displayProduct!.images?.length ? displayProduct!.images : [];
  const hasDiscount = currentProduct!.originalPrice && currentProduct!.originalPrice > currentProduct!.price;
  const discountPct = hasDiscount
    ? Math.round((1 - currentProduct!.price / currentProduct!.originalPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(currentProduct!, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const descParagraphs = displayProduct!.description
    ? displayProduct!.description
        .split(/(?<=\. )(?=[А-ЯІЇЄA-Z])/)
        .filter(p => p.trim().length > 20)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 sm:py-10">

        {/* Breadcrumb — visible navigation */}
        <nav aria-label="Навігація" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Головна</Link>
          <span aria-hidden>/</span>
          <Link to="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
          {category && (
            <>
              <span aria-hidden>/</span>
              <Link to={`/catalog?category=${category.id}`} className="hover:text-primary transition-colors">
                {category.name}
              </Link>
            </>
          )}
          <span aria-hidden>/</span>
          <span className="text-foreground line-clamp-1">{displayProduct!.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">

          {/* ── Images ── */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-3xl bg-secondary/30 overflow-hidden border border-border/40 grid place-items-center">
              {images[activeImg]
                ? (
                  <img
                    src={images[activeImg]}
                    alt={`${displayProduct!.name} — фото ${activeImg + 1}`}
                    className="h-full w-full object-contain p-6 sm:p-10"
                    // First image eager, rest lazy
                    loading={activeImg === 0 ? "eager" : "lazy"}
                    fetchPriority={activeImg === 0 ? "high" : "auto"}
                  />
                )
                : <div className="text-muted-foreground text-sm">Немає фото</div>
              }
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {displayProduct!.badge && (
                  <span className="rounded-lg bg-primary/90 px-3 py-1 text-xs font-semibold text-white shadow">
                    {displayProduct!.badge}
                  </span>
                )}
                {hasDiscount && (
                  <span className="rounded-lg bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
                    -{discountPct}%
                  </span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.slice(0, 5).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Фото ${i + 1}`}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? "border-primary" : "border-border/40 hover:border-primary/40"
                    }`}
                  >
                    <img src={img} alt="" aria-hidden className="h-full w-full object-contain p-1" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="space-y-5">
            {category && (
              <Link
                to={`/catalog?category=${category.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 px-3 py-1.5 rounded-full hover:bg-primary/15 transition-colors"
              >
                <Tag className="h-3 w-3" />{category.name}
              </Link>
            )}

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium leading-tight">
              {displayProduct!.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => {
                  const noReviews = !currentProduct!.reviews || currentProduct!.reviews === 0;
                  if (noReviews) return <Star key={i} className="h-5 w-5 fill-muted text-muted" />;
                  const diff = currentProduct!.rating - (i - 1);
                  if (diff >= 1) return <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />;
                  if (diff >= 0.4) return (
                    <span key={i} className="relative inline-flex h-5 w-5">
                      <Star className="h-5 w-5 fill-muted text-muted" />
                      <span className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      </span>
                    </span>
                  );
                  return <Star key={i} className="h-5 w-5 fill-muted text-muted" />;
                })}
              </div>
              {currentProduct!.reviews > 0 && (
                <>
                  <span className="text-sm font-medium">{currentProduct!.rating}</span>
                  <span className="text-sm text-muted-foreground">({currentProduct!.reviews} відгуків)</span>
                </>
              )}
            </div>

            {/* SKU */}
            {currentProduct!.vendorCode && (
              <div className="text-sm text-muted-foreground">
                Артикул: <span className="font-medium text-foreground">{currentProduct!.vendorCode}</span>
              </div>
            )}

            {/* Variant selector */}
            {variants.length > 1 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Розмір: <span className="text-primary">{selectedVariant?.variantLabel ?? variants[0]?.variantLabel}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => navigate(`/product/${v.id}`)}
                      aria-label={`Розмір ${v.variantLabel}`}
                      className={`min-w-[44px] h-10 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        v.id === (selectedVariant?.id ?? variants[0]?.id)
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white hover:border-primary/60 text-foreground"
                      }`}
                    >
                      {v.variantLabel}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price block */}
            <div className="rounded-2xl border border-border/50 bg-white p-4 sm:p-5 space-y-3">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">
                  {formatUAH(currentProduct!.price)}
                </span>
                {hasDiscount && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg text-muted-foreground line-through">
                      {formatUAH(currentProduct!.originalPrice!)}
                    </span>
                    <span className="rounded-lg bg-red-500 px-2.5 py-0.5 text-sm font-bold text-white">
                      -{discountPct}%
                    </span>
                  </div>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm text-green-600 font-medium">
                  ✓ Ви економите {formatUAH(currentProduct!.originalPrice! - currentProduct!.price)}
                </p>
              )}

              {/* Qty + Cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border border-border bg-background">
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10"
                    onClick={() => setQty(q => Math.max(1, q - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold text-base">{qty}</span>
                  <Button variant="ghost" size="icon" className="rounded-full h-10 w-10"
                    onClick={() => setQty(q => q + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="lg" onClick={handleAddToCart}
                  className={`flex-1 h-12 rounded-full border-0 font-medium text-sm transition-all duration-300 ${
                    added ? "bg-green-600 hover:bg-green-600" : "btn-aura"
                  }`}>
                  {added
                    ? <><Check className="h-5 w-5 mr-2" />Додано!</>
                    : <><ShoppingCart className="h-5 w-5 mr-2" />Додати в кошик</>
                  }
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Truck, label: "Доставка по Україні" },
                { icon: ShieldCheck, label: "Гарантія якості" },
                { icon: RotateCcw, label: "Повернення 14 днів" },
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 text-center">
                  <f.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-tight">{f.label}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="pt-2">
              <div className="flex border-b border-border">
                {[
                  { id: "desc", label: "Опис" },
                  { id: "reviews", label: `Відгуки (${currentProduct!.reviews || 0})` },
                  { id: "questions", label: "Питання" },
                ].map(tab => (
                  <button key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                {activeTab === "desc" && (
                  <div className="space-y-2.5 text-sm text-foreground/75 leading-relaxed">
                    {descParagraphs.length > 0 ? (
                      <>
                        {descParagraphs.slice(0, 3).map((para, i) => <p key={i}>{para.trim()}</p>)}
                        {descParagraphs.length > 3 && (
                          <details className="group">
                            <summary className="text-primary text-sm cursor-pointer hover:underline list-none">
                              Читати більше ↓
                            </summary>
                            <div className="space-y-2.5 mt-2.5">
                              {descParagraphs.slice(3).map((para, i) => <p key={i}>{para.trim()}</p>)}
                            </div>
                          </details>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground">Опис відсутній.</p>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && <ReviewsTab product={currentProduct!} />}

                {activeTab === "questions" && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Маєте питання про товар? Задайте його нам!</p>
                    <textarea
                      placeholder="Ваше питання..."
                      className="w-full rounded-xl border border-border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 mb-2"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <input placeholder="Ваше ім'я" className="flex-1 rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <input placeholder="Телефон або email" className="flex-1 rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <button className="rounded-full bg-primary text-white px-5 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                      Задати питання
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="aura-kicker mb-1">каталог</p>
                <h2 className="text-2xl sm:text-3xl font-medium">Схожі товари</h2>
              </div>
              {category && (
                <Link
                  to={`/catalog?category=${category.id}`}
                  className="hidden sm:flex items-center gap-1 text-sm text-primary hover:gap-2 transition-all"
                >
                  Всі в категорії →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {related.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  categoryName={categoryNameById.get(p.category)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
