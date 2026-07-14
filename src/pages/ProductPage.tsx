import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, Truck, ShieldCheck, RotateCcw, Check, Tag, Wallet, MessageCircle } from "lucide-react";
import { formatUAH } from "@/data/products";
import { useProductsAsLegacy, useAllProductsAsLegacy, useCategoriesAsLegacy } from "@/hooks/useShopData";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "@/components/ProductCard";
import { useSEO } from "@/hooks/useSEO";
import { OptimizedImage, vercelImg } from "@/components/OptimizedImage";
import { ProductReviews } from "@/components/ProductReviews";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import type { Product } from "@/data/products";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"];

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Build a 150-160 char meta description from product data */
const buildDescription = (
  product: Product,
  categoryName: string | undefined,
  price: number,
  categorySlug?: string
): string => {
  const base = product.description?.trim();
  const firstSentence = base
    ? base.replace(/([.!?])\s+/g, "$1\n").split("\n").find(s => s.length > 30) ?? base.slice(0, 120)
    : null;
  const beautyNote = categorySlug === "krasota-i-doglyad"
    ? " Купити в Україні з доставкою Новою Поштою. Салонний ефект вдома."
    : "";

  if (firstSentence && firstSentence.length >= 60) {
    const trimmed = firstSentence.slice(0, 120).replace(/[,.]?\s*$/, "");
    return categorySlug === "krasota-i-doglyad"
      ? `${trimmed}.${beautyNote}`
      : `${trimmed}. Купити за ${formatUAH(price)} з доставкою по Україні.`;
  }

  const cat = categoryName ? `${categoryName.toLowerCase()} ` : "";
  return `${product.name} — ${cat}від BodyHome. Ціна ${formatUAH(price)}, доставка Новою Поштою, оплата при отриманні.${beautyNote}`;
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

// ── Category-based CRO content ───────────────────────────────────────────────

const CATEGORY_BENEFIT: Record<string, string> = {
  // ── Top-level categories ──────────────────────────────────────────────────
  "ortopedychni-podushky":         "Підтримує правильне положення шиї та хребта під час сну",
  "ortopedychni-masazhni-kylymky": "Стимулює акупунктурні точки, знімає напругу та втому в ногах",
  "ortezy-i-bandazhi":             "Фіксує та підтримує суглоби при навантаженнях і реабілітації",
  "masazhery":                     "Знімає м'язову напругу та покращує кровообіг у проблемних зонах",
  "tovary-dlia-krasy":             "Доглядає за шкірою і допомагає розслабитись після важкого дня",
  "rozvyvaiuchi-ihrashky":         "Розвиває дрібну моторику та когнітивні здібності дитини",
  "ortopedychni-ustilky":          "Рівномірно розподіляє навантаження та знижує втому ніг",
  // ── Pillow subcategories ──────────────────────────────────────────────────
  "podushky-dlia-snu":             "Підтримує шию в правильному положенні для здорового глибокого сну",
  "podushky-dlia-vahitnykh":       "Підтримує живіт, спину та стегна для комфортного сну під час вагітності",
  "podushky-dlia-sidinnia":        "Знижує тиск на куприк та крижі при тривалому сидінні",
  "podushky-z-efektom-pamiati":    "Повторює контури тіла та рівномірно розподіляє тиск уві сні",
  "podushky-dytiachy":             "Підтримує формування правильної постави у дітей з перших місяців",
  // ── Massager subcategories ────────────────────────────────────────────────
  "elektrichni-masazhery":         "Знімає м'язову напругу за допомогою вібрації та теплової терапії",
  "ruchni-masazhery":              "Допомагає при болях у спині, шиї та ногах — завжди під рукою",
  // ── Mat subcategories ─────────────────────────────────────────────────────
  "aplikatory":                    "Стимулює нервові закінчення і відновлює тонус після важкого дня",
  "kylymky-pazly":                 "Масажує ступні та стимулює рефлекторні зони при кожному кроці",
  "kylymky-z-halkoiu":             "Масажує ступні природною галькою — як прогулянка по пляжу",
  "dytiachy-masazhni-kylymky":     "Розвиває дрібну моторику та тактильне сприйняття малюка",
  // ── Brace/orthosis subcategories ─────────────────────────────────────────
  "bandazhi":                      "Фіксує м'які тканини, зменшує біль і прискорює відновлення",
  "ortezy":                        "Жорстко фіксує суглоб, знімає навантаження та запобігає травмам",
  "nakolinnyky":                   "Стабілізує колінний суглоб при навантаженнях та під час реабілітації",
  // ── Insole subcategories ──────────────────────────────────────────────────
  "ustilky-dlia-doroslykh":        "Коригує положення стопи та знижує втому при тривалому ходінні",
  "ustilky-dlia-ditei":            "Формує правильну поставу і підтримує розвиток стопи у дітей",
  "pidpiatnyky":                   "Знімає навантаження з п'ятки та зменшує біль при шпорах",
  "napivustilky":                  "Підтримує передню частину стопи і зменшує тиск на пальці",
  // ── Beauty subcategories ──────────────────────────────────────────────────
  "krasota-i-doglyad":             "Доглядає за шкірою обличчя та тіла для свіжого вигляду щодня",
  "fitnes-ta-sport":               "Підвищує ефективність тренувань і прискорює відновлення м'язів",
  "reabilitatsiia":                "Прискорює відновлення після травм та операцій на опорно-руховому апараті",
  // ── Toy subcategories ─────────────────────────────────────────────────────
  "sensorno-rozvyvalni":           "Стимулює сенсорний розвиток і заспокоює дитину через тактильні відчуття",
};

const CATEGORY_WHO: Record<string, Array<{ icon: string; label: string }>> = {
  // ── Top-level categories ──────────────────────────────────────────────────
  "ortopedychni-podushky": [
    { icon: "💤", label: "Для здорового сну" },
    { icon: "💻", label: "Для роботи за комп'ютером" },
    { icon: "🤰", label: "Для вагітних" },
    { icon: "🏥", label: "Після операції на шиї" },
    { icon: "🧓", label: "При остеохондрозі" },
  ],
  "ortopedychni-masazhni-kylymky": [
    { icon: "🧘", label: "Для релаксу вдома" },
    { icon: "💼", label: "Після сидячої роботи" },
    { icon: "🏃", label: "Після тренувань" },
    { icon: "🦶", label: "При болях у ступнях" },
    { icon: "⚡", label: "Для покращення кровообігу" },
  ],
  "ortezy-i-bandazhi": [
    { icon: "🏥", label: "Під час реабілітації" },
    { icon: "⚽", label: "При заняттях спортом" },
    { icon: "🏗️", label: "При фізичній роботі" },
    { icon: "🦴", label: "Після травм або операцій" },
    { icon: "🧓", label: "При хронічних болях" },
  ],
  "masazhery": [
    { icon: "💆", label: "Для зняття напруги" },
    { icon: "💼", label: "Після сидячої роботи" },
    { icon: "🏃", label: "Для відновлення після спорту" },
    { icon: "🏠", label: "Для SPA вдома" },
    { icon: "🦵", label: "При важкості в ногах" },
  ],
  "tovary-dlia-krasy": [
    { icon: "💆‍♀️", label: "Для жінок 30+" },
    { icon: "🏠", label: "Для домашнього догляду" },
    { icon: "🌿", label: "Для антистрес процедур" },
    { icon: "🎁", label: "Як подарунок" },
    { icon: "✨", label: "Для SPA-ефекту вдома" },
  ],
  "rozvyvaiuchi-ihrashky": [
    { icon: "👶", label: "Для дітей від 1 до 7 років" },
    { icon: "🎓", label: "Для розвитку логіки" },
    { icon: "✋", label: "Для дрібної моторики" },
    { icon: "🏠", label: "Для гри вдома" },
    { icon: "🎁", label: "Як подарунок" },
  ],
  "ortopedychni-ustilky": [
    { icon: "🏃", label: "Для активного відпочинку" },
    { icon: "⚽", label: "Для занять спортом" },
    { icon: "👣", label: "При плоскостопості" },
    { icon: "💼", label: "Для роботи на ногах" },
    { icon: "🏔️", label: "Для тривалих прогулянок" },
  ],
  // ── Pillow subcategories ──────────────────────────────────────────────────
  "podushky-dlia-snu": [
    { icon: "💤", label: "Для здорового глибокого сну" },
    { icon: "🤕", label: "При болях у шиї та спині" },
    { icon: "😴", label: "При порушенні сну" },
    { icon: "🧓", label: "При остеохондрозі" },
    { icon: "💆", label: "Для повного розслаблення" },
  ],
  "podushky-dlia-vahitnykh": [
    { icon: "🤰", label: "Для вагітних" },
    { icon: "🍼", label: "Для годуючих мам" },
    { icon: "💤", label: "Для комфортного сну" },
    { icon: "💆‍♀️", label: "При болях у спині та тазі" },
    { icon: "🎁", label: "Як подарунок майбутній мамі" },
  ],
  "podushky-dlia-sidinnia": [
    { icon: "💼", label: "Для офісних працівників" },
    { icon: "🚗", label: "Для водіїв" },
    { icon: "🏥", label: "Після операцій на куприку" },
    { icon: "🧓", label: "При болях у крижах" },
    { icon: "💻", label: "При тривалій роботі за ПК" },
  ],
  "podushky-z-efektom-pamiati": [
    { icon: "💤", label: "Для чутливого сну" },
    { icon: "🤕", label: "При болях у шиї" },
    { icon: "🧓", label: "При остеохондрозі" },
    { icon: "💆", label: "Для максимального комфорту" },
    { icon: "🎁", label: "Як преміум-подарунок" },
  ],
  "podushky-dytiachy": [
    { icon: "👶", label: "Для немовлят від 1 місяця" },
    { icon: "🎒", label: "Для дошкільнят" },
    { icon: "💤", label: "Для здорового сну дитини" },
    { icon: "🦴", label: "Для формування правильної постави" },
    { icon: "🎁", label: "Як подарунок на народження" },
  ],
  // ── Massager subcategories ────────────────────────────────────────────────
  "elektrichni-masazhery": [
    { icon: "💆", label: "Для зняття напруги" },
    { icon: "💼", label: "Після сидячої роботи" },
    { icon: "🏃", label: "Для відновлення після спорту" },
    { icon: "🏠", label: "Для SPA вдома" },
    { icon: "🔌", label: "При хронічних болях у спині" },
  ],
  "ruchni-masazhery": [
    { icon: "💆", label: "Для самомасажу вдома" },
    { icon: "✈️", label: "Для подорожей — завжди з собою" },
    { icon: "💼", label: "Для офісу" },
    { icon: "🏃", label: "Після тренувань" },
    { icon: "🧓", label: "Для людей старшого віку" },
  ],
  // ── Mat subcategories ─────────────────────────────────────────────────────
  "aplikatory": [
    { icon: "💆", label: "Для розслаблення спини" },
    { icon: "💼", label: "Після напруженого дня" },
    { icon: "🏃", label: "Для відновлення після спорту" },
    { icon: "🦶", label: "Для масажу ступень" },
    { icon: "⚡", label: "Для покращення кровообігу" },
  ],
  "kylymky-pazly": [
    { icon: "🧘", label: "Для релаксу вдома" },
    { icon: "💼", label: "Після сидячої роботи" },
    { icon: "🏃", label: "Після тренувань" },
    { icon: "🦶", label: "При болях у ступнях" },
    { icon: "⚡", label: "Для покращення кровообігу" },
  ],
  "kylymky-z-halkoiu": [
    { icon: "🧘", label: "Для релаксу та медитації" },
    { icon: "🦶", label: "Для масажу ступень" },
    { icon: "🌿", label: "Для SPA-ефекту вдома" },
    { icon: "⚡", label: "Для покращення кровообігу" },
    { icon: "💼", label: "Після сидячої роботи" },
  ],
  "dytiachy-masazhni-kylymky": [
    { icon: "👶", label: "Для дітей від 0 до 3 років" },
    { icon: "✋", label: "Для розвитку тактильних відчуттів" },
    { icon: "🧠", label: "Для когнітивного розвитку" },
    { icon: "🏠", label: "Для ігрових куточків" },
    { icon: "🎁", label: "Як подарунок" },
  ],
  // ── Brace/orthosis subcategories ─────────────────────────────────────────
  "bandazhi": [
    { icon: "🏥", label: "Під час реабілітації" },
    { icon: "⚽", label: "При заняттях спортом" },
    { icon: "🤰", label: "Під час вагітності" },
    { icon: "💼", label: "При тривалому стоянні" },
    { icon: "🦴", label: "При хронічних болях" },
  ],
  "ortezy": [
    { icon: "🏥", label: "Після травм і операцій" },
    { icon: "⚽", label: "Для профілактики при спорті" },
    { icon: "🦴", label: "При артриті та артрозі" },
    { icon: "🏗️", label: "При важкій фізичній роботі" },
    { icon: "👴", label: "При вікових змінах суглобів" },
  ],
  "nakolinnyky": [
    { icon: "⚽", label: "Для спортсменів" },
    { icon: "🏥", label: "Під час реабілітації коліна" },
    { icon: "🏗️", label: "При роботі на ногах" },
    { icon: "🧓", label: "При артрозі коліна" },
    { icon: "🚶", label: "Для тривалих прогулянок" },
  ],
  // ── Insole subcategories ──────────────────────────────────────────────────
  "ustilky-dlia-doroslykh": [
    { icon: "🏃", label: "Для активних людей" },
    { icon: "💼", label: "Для роботи на ногах" },
    { icon: "👣", label: "При плоскостопості" },
    { icon: "⚽", label: "Для занять спортом" },
    { icon: "🏔️", label: "Для тривалих прогулянок" },
  ],
  "ustilky-dlia-ditei": [
    { icon: "👶", label: "Для дітей від 3 років" },
    { icon: "⚽", label: "Для активних дітей" },
    { icon: "👣", label: "При плоскостопості у дітей" },
    { icon: "🏫", label: "Для шкільного взуття" },
    { icon: "🦴", label: "Для формування стопи" },
  ],
  "pidpiatnyky": [
    { icon: "👠", label: "При болях у п'ятці" },
    { icon: "🦷", label: "При п'ятковій шпорі" },
    { icon: "💼", label: "Для роботи на ногах" },
    { icon: "👟", label: "Для спортивного взуття" },
    { icon: "🏥", label: "Під час реабілітації" },
  ],
  "napivustilky": [
    { icon: "👠", label: "Для взуття на підборах" },
    { icon: "💃", label: "При натоптишах та мозолях" },
    { icon: "💼", label: "Для повсякденного взуття" },
    { icon: "🏃", label: "Для активного відпочинку" },
    { icon: "👟", label: "Для зменшення тиску на пальці" },
  ],
  // ── Beauty subcategories ──────────────────────────────────────────────────
  "krasota-i-doglyad": [
    { icon: "💆‍♀️", label: "Для домашнього догляду" },
    { icon: "✨", label: "Для SPA-ефекту вдома" },
    { icon: "🌿", label: "Для антистрес процедур" },
    { icon: "🎁", label: "Як подарунок" },
    { icon: "👩", label: "Для жінок будь-якого віку" },
  ],
  "fitnes-ta-sport": [
    { icon: "🏋️", label: "Для фітнесу та тренувань" },
    { icon: "🏃", label: "Для бігунів і спортсменів" },
    { icon: "🧘", label: "Для йоги та пілатесу" },
    { icon: "💆", label: "Для відновлення після тренувань" },
    { icon: "🏆", label: "Для аматорів та профі" },
  ],
  "reabilitatsiia": [
    { icon: "🏥", label: "Після операцій і травм" },
    { icon: "🦴", label: "При захворюваннях суглобів" },
    { icon: "🧓", label: "Для людей старшого віку" },
    { icon: "💆", label: "Для фізичної терапії" },
    { icon: "🔄", label: "Для поступового відновлення" },
  ],
  // ── Toy subcategories ─────────────────────────────────────────────────────
  "sensorno-rozvyvalni": [
    { icon: "🧒", label: "Для дітей від 6 місяців" },
    { icon: "✋", label: "Для розвитку дрібної моторики" },
    { icon: "🧠", label: "Для сенсорного розвитку" },
    { icon: "🌿", label: "Для заспокоєння" },
    { icon: "🎁", label: "Як подарунок" },
  ],
};

// Lookup with fallback to parent category slug
const getCategoryContent = <T,>(
  map: Record<string, T>,
  categoryId: string | undefined,
  parentId: string | undefined
): T | undefined => {
  if (!categoryId) return undefined;
  return map[categoryId] ?? (parentId ? map[parentId] : undefined);
};

const COMPLEMENTARY: Record<string, string[]> = {
  "ortopedychni-podushky":         ["masazhery", "ortopedychni-ustilky"],
  "masazhery":                     ["ortopedychni-masazhni-kylymky", "ortopedychni-podushky"],
  "ortopedychni-masazhni-kylymky": ["masazhery", "ortopedychni-ustilky"],
  "ortezy-i-bandazhi":             ["ortopedychni-ustilky", "masazhery"],
  "ortopedychni-ustilky":          ["ortezy-i-bandazhi", "ortopedychni-masazhni-kylymky"],
  "rozvyvaiuchi-ihrashky":         ["ortopedychni-podushky", "ortopedychni-ustilky"],
  "tovary-dlia-krasy":             ["masazhery", "ortopedychni-masazhni-kylymky"],
};

const WHY_BODYHOME = [
  { icon: Wallet,        title: "Оплата при отриманні",    desc: "Платите тільки після того, як отримали й перевірили товар." },
  { icon: Truck,         title: "Доставка по Україні",     desc: "Нова Пошта, Meest. Відправка наступного дня після замовлення." },
  { icon: RotateCcw,     title: "14 днів на повернення",   desc: "Якщо товар не підійшов — повернемо гроші без зайвих питань." },
  { icon: ShieldCheck,   title: "Перевірка перед оплатою", desc: "Можете відкрити посилку та перевірити вміст перед тим, як платити." },
  { icon: MessageCircle, title: "Підтримка у Telegram",    desc: "Відповімо на будь-яке питання у Telegram або Viber." },
];

// ── Main component ───────────────────────────────────────────────────────────

const ProductPage = () => {
  const { id } = useParams();
  const { products, isLoading } = useProductsAsLegacy();
  const { products: allProducts } = useAllProductsAsLegacy();
  const { categories } = useCategoriesAsLegacy();
  const { addItem } = useCart();

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "reviews" | "questions">("desc");
  const [selectedVarIdx, setSelectedVarIdx] = useState(-1);
  const [selectedSiblingIdx, setSelectedSiblingIdx] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const cartBtnRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();
  const recentIds = useRecentlyViewed(id ?? "");

  // Reset sibling selection when URL changes (different product)
  useEffect(() => { setSelectedSiblingIdx(0); }, [id]);

  // ── Sticky bar effect — must stay here (before early returns) to respect Rules of Hooks ──
  useEffect(() => {
    if (!isMobile || !cartBtnRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(cartBtnRef.current);
    return () => observer.disconnect();
  }, [isMobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Resolve product data (before any conditional returns so hooks stay stable) ──
  // Lookup order:
  //   1. legacy_id / UUID exact match
  //   2. exact slug match
  //   3. raw UUID match (allProducts)
  //   4. exact slug match (allProducts)
  //   5. UUID hex-suffix fallback — handles stale Google Ads slugs where the
  //      URL ends with an older/shorter UUID suffix (e.g. "sm-85649a") but the
  //      DB slug was later regenerated with a longer suffix ("sm-bd85649a").
  //      Slugs are always generated as <name>-<last-N-hex-chars-of-uuid>.
  const idSuffix = typeof id === "string" ? id.split("-").pop()?.toLowerCase() : undefined;
  const isHexSuffix = idSuffix ? /^[0-9a-f]{4,}$/.test(idSuffix) : false;
  const foundProduct =
    products.find(p => p.id === id) ??
    products.find(p => p.slug === id) ??
    allProducts.find(p => p.id === id) ??
    allProducts.find(p => p.slug === id) ??
    (isHexSuffix
      ? products.find(p => p.id.replace(/-/g, "").endsWith(idSuffix!)) ??
        allProducts.find(p => p.id.replace(/-/g, "").endsWith(idSuffix!))
      : undefined);
  const displayProduct = foundProduct;

  // JSONB variants from the product itself, sorted by size
  const variants = useMemo(() => {
    const raw = foundProduct?.variants ?? [];
    return [...raw].sort((a, b) => {
      const ai = SIZE_ORDER.indexOf(a.label);
      const bi = SIZE_ORDER.indexOf(b.label);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      const na = parseFloat(a.label);
      const nb = parseFloat(b.label);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.label.localeCompare(b.label);
    });
  }, [foundProduct]);

  const selectedVariant = variants[selectedVarIdx] ?? null;

  // Sibling variants from parent-child DB structure (active when JSONB variants absent)
  const siblingVariants = useMemo(() => {
    if (!foundProduct?.isParent || !foundProduct.variantLabel || variants.length > 0) return [];
    const children = allProducts
      .filter(p => p.parentProductId === foundProduct.id && p.variantLabel)
      .map(c => ({
        label: c.variantLabel as string,
        price: c.price,
        vendorCode: c.vendorCode,
        available: c.available,
        productId: c.id,
        productName: c.name,
      }));
    if (children.length === 0) return [];
    const all = [
      {
        label: foundProduct.variantLabel,
        price: foundProduct.price,
        vendorCode: foundProduct.vendorCode,
        available: foundProduct.available,
        productId: foundProduct.id,
        productName: foundProduct.name,
      },
      ...children,
    ];
    return all.sort((a, b) => {
      const na = parseFloat(a.label);
      const nb = parseFloat(b.label);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.label.localeCompare(b.label);
    });
  }, [foundProduct, variants, allProducts]);

  const selectedSibling = siblingVariants.length > 1 ? (siblingVariants[selectedSiblingIdx] ?? siblingVariants[0]) : null;

  const currentProduct  = foundProduct;
  const category        = displayProduct ? categories.find(c => c.id === displayProduct.category) : null;
  const categoryName     = category?.name;

  // Category name lookup for related cards
  const categoryNameById = useMemo(
    () => new Map(categories.map(c => [c.id, c.name])),
    [categories]
  );

  // Complementary category slugs for this product's category
  const complementaryCatSlugs = useMemo(() => {
    const catId = category?.id ?? "";
    const parentId = (category?.parentId as string | undefined) ?? "";
    return COMPLEMENTARY[catId] ?? COMPLEMENTARY[parentId] ?? [];
  }, [category]);

  // Products from complementary categories (different from this product's category)
  const complementaryProducts = useMemo(() => {
    const mainCatId  = category?.id ?? "";
    const parentId   = (category?.parentId as string | undefined) ?? "";

    // Sibling sub-categories (same parent, different sub-category) — most relevant add-ons
    const siblingIds = new Set<string>(
      categories
        .filter(c => c.parentId && c.parentId === parentId && c.id !== mainCatId)
        .map(c => c.id)
    );

    // Cross-category complementary map
    const crossIds = new Set<string>(
      complementaryCatSlugs.length
        ? categories.flatMap(c =>
            complementaryCatSlugs.includes(c.id) || complementaryCatSlugs.includes(c.parentId as string)
              ? [c.id]
              : []
          )
        : []
    );

    const candidateIds = new Set([...siblingIds, ...crossIds]);
    if (!candidateIds.size) return [];

    return products
      .filter(p => candidateIds.has(p.category) && p.id !== (foundProduct?.id ?? "") && p.available)
      // Sort by popularity so the best-reviewed products surface first
      .sort((a, b) => b.reviews * b.rating - a.reviews * a.rating)
      .slice(0, 8);
  }, [products, categories, complementaryCatSlugs, category, foundProduct]);

  // ── SEO — always called unconditionally ──────────────────────────────────
  const seoDescription = displayProduct && currentProduct
    ? buildDescription(displayProduct, categoryName, currentProduct.price, category?.id)
    : undefined;

  const seoKeywords = displayProduct
    ? buildKeywords(displayProduct, categoryName)
    : undefined;

  const seoFAQ = useMemo(() =>
    displayProduct && currentProduct
      ? buildProductFAQ(displayProduct.name, currentProduct.price, currentProduct.available)
      : undefined,
    [displayProduct, currentProduct]
  );

  const seoAggregateRating = useMemo(() =>
    currentProduct && currentProduct.reviews > 0
      ? { ratingValue: currentProduct.rating, reviewCount: currentProduct.reviews }
      : undefined,
    [currentProduct]
  );

  const seoBreadcrumbs = useMemo(() =>
    displayProduct
      ? [
          { name: "Каталог", url: "/catalog" },
          ...(category ? [{ name: category.name, url: `/catalog?category=${category.id}` }] : []),
          { name: displayProduct.name, url: `/product/${displayProduct.slug ?? displayProduct.id}` },
        ]
      : undefined,
    [displayProduct, category]
  );

  useSEO({
    title:             displayProduct?.name,
    description:       seoDescription,
    keywords:          seoKeywords,
    image:             displayProduct?.images?.[0],
    images:            displayProduct?.images,
    url:               displayProduct ? `/product/${displayProduct.slug ?? displayProduct.id}` : "/catalog",
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
  // Child variant: redirect to the parent product page
  if (foundProduct.parentProductId) {
    const parent =
      products.find(p => p.id === foundProduct.parentProductId) ??
      allProducts.find(p => p.id === foundProduct.parentProductId);
    return <Navigate to={`/product/${parent?.slug ?? parent?.id ?? ''}`} replace />;
  }

  // ── Derived values ───────────────────────────────────────────────────────
  const related = products
    .filter(p => p.category === displayProduct!.category && p.id !== displayProduct!.id)
    .slice(0, 4);

  const images        = displayProduct!.images?.length ? displayProduct!.images : [];
  const activePrice   = selectedVariant?.price ?? selectedSibling?.price ?? currentProduct!.price;
  const hasDiscount   = currentProduct!.originalPrice && currentProduct!.originalPrice > activePrice;
  const discountPct   = hasDiscount
    ? Math.round((1 - activePrice / currentProduct!.originalPrice!) * 100)
    : 0;
  const activeVendorCode = selectedVariant?.vendor_code || selectedSibling?.vendorCode || currentProduct!.vendorCode;
  const bundleProduct = (() => {
    if (!complementaryProducts.length) return null;
    const scored = complementaryProducts.map(p => {
      const ratio = p.price / (activePrice || 1);
      const priceBonus = ratio >= 0.05 && ratio <= 0.7 ? 2 : ratio <= 1.5 ? 1 : 0.5;
      return { p, score: priceBonus * Math.log1p(p.reviews + 1) * p.rating };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.p ?? null;
  })();
  const bundleTotal = bundleProduct ? Math.round((activePrice + bundleProduct.price) * 0.95) : 0;

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem({
        ...currentProduct!,
        id: `${currentProduct!.id}__${selectedVariant.label}`,
        name: `${displayProduct!.name} (${selectedVariant.label})`,
        price: selectedVariant.price,
        variantLabel: selectedVariant.label,
        vendorCode: selectedVariant.vendor_code || currentProduct!.vendorCode,
      }, qty);
    } else if (selectedSibling && selectedSibling.productId !== currentProduct!.id) {
      addItem({
        ...currentProduct!,
        id: selectedSibling.productId,
        name: selectedSibling.productName,
        price: selectedSibling.price,
        variantLabel: selectedSibling.label,
        vendorCode: selectedSibling.vendorCode || currentProduct!.vendorCode,
      }, qty);
    } else {
      addItem(currentProduct!, qty);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const descParagraphs = displayProduct!.description
    ? displayProduct!.description
        .split(/\. (?=[А-ЯІЇЄA-Z])/)
        .map((p, i, arr) => (i < arr.length - 1 ? p + "." : p))
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
              {images[activeImg] ? (
                <OptimizedImage
                  src={images[activeImg]}
                  alt={`${displayProduct!.name} — фото ${activeImg + 1}`}
                  className="h-full w-full object-contain p-6 sm:p-10"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={85}
                  loading={activeImg === 0 ? "eager" : "lazy"}
                  fetchPriority={activeImg === 0 ? "high" : "auto"}
                />
              ) : (
                <div className="text-muted-foreground text-sm">Немає фото</div>
              )}
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
                    <OptimizedImage src={img} alt="" aria-hidden className="h-full w-full object-contain p-1" sizes="80px" quality={70} />
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

            {/* Availability badge */}
            <div>
              {currentProduct!.available ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />В наявності
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />Немає в наявності
                </span>
              )}
            </div>

            {/* Benefit line */}
            {category && getCategoryContent(CATEGORY_BENEFIT, category.id, category.parentId as string | undefined) && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 shrink-0" />
                {getCategoryContent(CATEGORY_BENEFIT, category.id, category.parentId as string | undefined)}
              </p>
            )}

            {/* SKU */}
            {activeVendorCode && (
              <div className="text-sm text-muted-foreground">
                Артикул: <span className="font-medium text-foreground">{activeVendorCode}</span>
              </div>
            )}

            {/* Variant selector */}
            {variants.length > 1 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Розмір:{" "}
                  {selectedVarIdx >= 0
                    ? <span className="text-primary font-semibold">{selectedVariant?.label}</span>
                    : <span className="text-orange-500 font-medium">оберіть ↓</span>
                  }
                </p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v, i) => (
                    <button
                      key={v.label}
                      onClick={() => setSelectedVarIdx(i)}
                      aria-label={`Розмір ${v.label}`}
                      disabled={!v.available}
                      className={`min-w-[44px] h-10 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        i === selectedVarIdx
                          ? "border-primary bg-primary text-white shadow-sm"
                          : v.available
                            ? "border-border bg-white hover:border-primary/60 text-foreground"
                            : "border-border bg-secondary/50 text-muted-foreground opacity-50 cursor-not-allowed line-through"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
                {selectedVarIdx < 0 && (
                  <p className="text-xs text-orange-500 flex items-center gap-1">
                    <span>⚠</span> Будь ласка, оберіть розмір перед замовленням
                  </p>
                )}
              </div>
            )}

            {/* Sibling size selector (parent-child DB structure) */}
            {siblingVariants.length > 1 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Розмір:{" "}
                  <span className="text-primary font-semibold">{siblingVariants[selectedSiblingIdx]?.label}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {siblingVariants.map((v, i) => (
                    <button
                      key={v.label}
                      onClick={() => setSelectedSiblingIdx(i)}
                      aria-label={`Розмір ${v.label}`}
                      disabled={!v.available}
                      className={`min-w-[44px] h-10 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        i === selectedSiblingIdx
                          ? "border-primary bg-primary text-white shadow-sm"
                          : v.available
                            ? "border-border bg-white hover:border-primary/60 text-foreground"
                            : "border-border bg-secondary/50 text-muted-foreground opacity-50 cursor-not-allowed line-through"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price block */}
            <div className="rounded-2xl border border-border/50 bg-white p-4 sm:p-5 space-y-3">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">
                  {formatUAH(activePrice)}
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
                  ✓ Ви економите {formatUAH(currentProduct!.originalPrice! - activePrice)}
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
                <Button ref={cartBtnRef} size="lg" onClick={handleAddToCart}
                  disabled={variants.length > 1 && selectedVarIdx < 0}
                  className={`flex-1 h-12 rounded-full border-0 font-medium text-sm transition-all duration-300 ${
                    added ? "bg-green-600 hover:bg-green-600"
                    : variants.length > 1 && selectedVarIdx < 0 ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "btn-aura"
                  }`}>
                  {added
                    ? <><Check className="h-5 w-5 mr-2" />Додано!</>
                    : variants.length > 1 && selectedVarIdx < 0
                      ? "Оберіть розмір ↑"
                      : <><ShoppingCart className="h-5 w-5 mr-2" />Додати в кошик</>
                  }
                </Button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Truck, label: "Доставка по Україні", href: "/delivery" },
                { icon: ShieldCheck, label: "Гарантія якості", href: "/about" },
                { icon: RotateCcw, label: "Повернення 14 днів", href: "/delivery" },
              ].map((f, i) => (
                <Link key={i} to={f.href} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/50 text-center hover:bg-primary/8 transition-colors">
                  <f.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-tight">{f.label}</span>
                </Link>
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
                  <div className="space-y-5">
                    {/* Description text */}
                    <div className="space-y-2.5 text-sm leading-relaxed">
                      {descParagraphs.length > 0 ? (
                        <>
                          <p className="text-foreground/90 font-[450]">{descParagraphs[0].trim()}</p>
                          {descParagraphs.slice(1, 3).map((para, i) => (
                            <p key={i} className="text-foreground/70">{para.trim()}</p>
                          ))}
                          {descParagraphs.length > 3 && (
                            <details className="group">
                              <summary className="text-primary text-sm cursor-pointer hover:underline list-none">
                                Читати більше ↓
                              </summary>
                              <div className="space-y-2.5 mt-2.5">
                                {descParagraphs.slice(3).map((para, i) => (
                                  <p key={i} className="text-foreground/70">{para.trim()}</p>
                                ))}
                              </div>
                            </details>
                          )}
                        </>
                      ) : (
                        <p className="text-muted-foreground">Опис відсутній.</p>
                      )}
                    </div>

                    {/* Delivery & payment mini-block */}
                    <div className="rounded-xl bg-secondary/50 px-4 py-3.5 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/60 mb-2.5">Доставка та оплата</p>
                      <ul className="space-y-1.5 text-sm text-foreground/75">
                        <li className="flex items-center gap-2.5"><Truck className="h-3.5 w-3.5 text-primary shrink-0" />Нова Пошта, Meest — 1–3 робочі дні по Україні</li>
                        <li className="flex items-center gap-2.5"><Wallet className="h-3.5 w-3.5 text-primary shrink-0" />Оплата при отриманні або онлайн</li>
                        <li className="flex items-center gap-2.5"><RotateCcw className="h-3.5 w-3.5 text-primary shrink-0" />Повернення протягом 14 днів</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && <ProductReviews productId={currentProduct!.id} />}

                {activeTab === "questions" && (
                  <div className="space-y-5">
                    {seoFAQ && seoFAQ.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Часті запитання</p>
                        <Accordion type="single" collapsible className="space-y-1">
                          {seoFAQ.map((faq, i) => (
                            <AccordionItem key={i} value={`faq-${i}`} className="border border-border/40 rounded-xl px-4 overflow-hidden">
                              <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline text-left">
                                {faq.q}
                              </AccordionTrigger>
                              <AccordionContent className="text-sm text-muted-foreground pb-3 leading-relaxed">
                                {faq.a}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}
                    <div className="border-t border-border/40 pt-4">
                      <p className="text-sm text-muted-foreground mb-3">Не знайшли відповіді? Задайте питання нам!</p>
                      <textarea
                        placeholder="Ваше питання..."
                        className="w-full rounded-xl border border-border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 mb-2"
                        rows={3}
                      />
                      <div className="flex gap-2 mb-3">
                        <input placeholder="Ваше ім'я" className="flex-1 rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        <input placeholder="Телефон або email" className="flex-1 rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <button className="rounded-full bg-primary text-white px-5 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                        Задати питання
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Кому підійде ──────────────────────────────────────────────── */}
        {category && (() => {
          const whoItems = getCategoryContent(CATEGORY_WHO, category.id, category.parentId as string | undefined);
          if (!whoItems) return null;
          return (
          <section className="mt-12 sm:mt-16">
            <div className="mb-5">
              <p className="aura-kicker mb-1">застосування</p>
              <h2 className="text-xl sm:text-2xl font-medium">Кому підійде</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {whoItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-2xl border border-border/50 bg-white px-4 py-2.5 text-sm font-medium shadow-sm"
                >
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>
          );
        })()}

        {/* ── Чому обирають BodyHome ────────────────────────────────────── */}
        <section className="mt-12 sm:mt-14">
          <div className="mb-5">
            <p className="aura-kicker mb-1">довіра</p>
            <h2 className="text-xl sm:text-2xl font-medium">Чому обирають BodyHome</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {WHY_BODYHOME.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-2xl border border-border/40 bg-white p-4 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10">
                  <item.icon className="h-4.5 w-4.5 text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold leading-snug">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Комплект зі знижкою ───────────────────────────────────────── */}
        {bundleProduct && (
          <section className="mt-12 sm:mt-14">
            <div className="mb-5">
              <p className="aura-kicker mb-1">вигідна пропозиція</p>
              <h2 className="text-xl sm:text-2xl font-medium">Комплект зі знижкою 5%</h2>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Current product */}
                <div className="flex flex-col items-center gap-2 min-w-[90px]">
                  <div className="h-20 w-20 rounded-xl bg-white border border-border/40 grid place-items-center overflow-hidden">
                    {currentProduct!.images?.[0] ? (
                      <OptimizedImage src={currentProduct!.images[0]} alt={currentProduct!.name} className="h-full w-full object-contain p-2" sizes="80px" quality={70} />
                    ) : <div className="h-full w-full bg-secondary/30" />}
                  </div>
                  <p className="text-xs text-center line-clamp-2 max-w-[100px] text-muted-foreground">{displayProduct!.name}</p>
                  <p className="text-sm font-semibold">{formatUAH(activePrice)}</p>
                </div>

                <span className="text-2xl font-light text-muted-foreground">+</span>

                {/* Bundle companion */}
                <Link to={`/product/${bundleProduct.slug ?? bundleProduct.id}`} className="flex flex-col items-center gap-2 min-w-[90px] hover:opacity-80 transition-opacity">
                  <div className="h-20 w-20 rounded-xl bg-white border border-border/40 grid place-items-center overflow-hidden">
                    {bundleProduct.images?.[0] ? (
                      <OptimizedImage src={bundleProduct.images[0]} alt={bundleProduct.name} className="h-full w-full object-contain p-2" sizes="80px" quality={70} />
                    ) : <div className="h-full w-full bg-secondary/30" />}
                  </div>
                  <p className="text-xs text-center line-clamp-2 max-w-[100px] text-muted-foreground">{bundleProduct.name}</p>
                  <p className="text-sm font-semibold">{formatUAH(bundleProduct.price)}</p>
                </Link>

                {/* Price + CTA */}
                <div className="flex-1 min-w-[180px] space-y-2.5">
                  <div>
                    <p className="text-xs text-muted-foreground line-through">{formatUAH(activePrice + bundleProduct.price)}</p>
                    <p className="text-2xl font-bold text-primary">{formatUAH(bundleTotal)}</p>
                    <p className="text-xs text-green-600 font-medium mt-0.5">
                      Економія {formatUAH(Math.round(activePrice + bundleProduct.price - bundleTotal))}
                    </p>
                  </div>
                  <Button
                    className="w-full rounded-full btn-aura border-0"
                    disabled={variants.length > 1 && selectedVarIdx < 0}
                    onClick={() => {
                      if (selectedVariant) {
                        addItem({ ...currentProduct!, id: `${currentProduct!.id}__${selectedVariant.label}`, name: `${displayProduct!.name} (${selectedVariant.label})`, price: selectedVariant.price, variantLabel: selectedVariant.label, vendorCode: selectedVariant.vendor_code || currentProduct!.vendorCode }, 1);
                      } else if (selectedSibling && selectedSibling.productId !== currentProduct!.id) {
                        addItem({ ...currentProduct!, id: selectedSibling.productId, name: selectedSibling.productName, price: selectedSibling.price, variantLabel: selectedSibling.label, vendorCode: selectedSibling.vendorCode || currentProduct!.vendorCode }, 1);
                      } else {
                        addItem(currentProduct!, 1);
                      }
                      addItem(bundleProduct, 1);
                      setAdded(true);
                      setTimeout(() => setAdded(false), 2000);
                    }}
                  >
                    {variants.length > 1 && selectedVarIdx < 0 ? "Оберіть розмір ↑" : "Купити разом зі знижкою 5%"}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── З цим товаром купують ─────────────────────────────────────── */}
        {complementaryProducts.length > 0 && (
          <section className="mt-12 sm:mt-14">
            <div className="mb-5">
              <p className="aura-kicker mb-1">доповнення</p>
              <h2 className="text-xl sm:text-2xl font-medium">З цим товаром купують</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {complementaryProducts.map(p => (
                <ProductCard key={p.id} product={p} categoryName={categoryNameById.get(p.category)} />
              ))}
            </div>
          </section>
        )}

        {/* Sticky mobile add-to-cart bar — always rendered, slides in/out */}
        <div
          className={`md:hidden fixed bottom-14 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
            showStickyBar ? "translate-y-0" : "translate-y-full"
          }`}
          aria-hidden={!showStickyBar}
        >
          <div
            className="bg-white border-t border-border/60 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate leading-snug">{displayProduct!.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-sm font-bold text-primary">{formatUAH(activePrice)}</p>
                  {hasDiscount && (
                    <p className="text-[11px] text-muted-foreground line-through leading-none">
                      {formatUAH(currentProduct!.originalPrice!)}
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={handleAddToCart}
                disabled={variants.length > 1 && selectedVarIdx < 0}
                aria-label="Додати в кошик"
                className={`shrink-0 rounded-full border-0 h-10 px-5 text-sm font-medium touch-manipulation ${
                  added ? "bg-green-600 hover:bg-green-600"
                  : variants.length > 1 && selectedVarIdx < 0 ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "btn-aura"
                }`}
              >
                {added
                  ? <><Check className="h-4 w-4 mr-1.5" />Додано</>
                  : variants.length > 1 && selectedVarIdx < 0
                    ? "Оберіть розмір ↑"
                    : <><ShoppingCart className="h-4 w-4 mr-1.5" />В кошик</>
                }
              </Button>
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

        {/* Recently viewed */}
        {recentIds.length > 0 && (() => {
          const recentProducts = recentIds
            .map(rid => products.find(p => p.id === rid))
            .filter(Boolean)
            .slice(0, 4) as typeof products;
          if (!recentProducts.length) return null;
          return (
            <section className="mt-12 sm:mt-16">
              <div className="mb-5">
                <p className="aura-kicker mb-1">нещодавно</p>
                <h2 className="text-xl sm:text-2xl font-medium">Нещодавно переглянуті</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {recentProducts.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    categoryName={categoryNameById.get(p.category)}
                  />
                ))}
              </div>
            </section>
          );
        })()}

        {/* Mobile spacer — keeps content above sticky add-to-cart bar + bottom nav */}
        <div className="h-32 md:hidden" aria-hidden="true" />
      </div>
    </div>
  );
};

export default ProductPage;
