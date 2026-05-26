import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_SITE_URL || "https://aurahomeua.vercel.app";
const SITE_NAME = "BodyHome";
const DEFAULT_DESC = "BodyHome — інтернет-магазин ортопедичних товарів: подушки, устілки, бандажі, масажери. Перевірена якість, доставка Новою Поштою по всій Україні.";
const DEFAULT_IMG = `${BASE_URL}/og-image.jpg`;

const setMeta = (name: string, content: string, attr = "name") => {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setLink = (rel: string, href: string) => {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const setSchema = (id: string, data: object) => {
  let el = document.querySelector(`script[data-schema="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-schema", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  price?: number;
  originalPrice?: number;
  availability?: boolean;
  breadcrumbs?: { name: string; url: string }[];
  faq?: { q: string; a: string }[];
  articleDate?: string;
  keywords_extra?: string;
}

export const useSEO = ({
  title,
  description,
  keywords,
  image = DEFAULT_IMG,
  url = "/",
  type = "website",
  price,
  originalPrice,
  availability = true,
  breadcrumbs,
  faq,
  articleDate,
}: SEOProps = {}) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} — Ортопедичні товари, масажери та устілки | Доставка по Україні`;
    const fullDesc = description ?? DEFAULT_DESC;
    const fullUrl = `${BASE_URL}${url}`;
    const fullImg = image?.startsWith("http") ? image : `${BASE_URL}${image}`;

    // Basic meta
    document.title = fullTitle;
    setMeta("description", fullDesc);
    if (keywords) setMeta("keywords", keywords);
    setLink("canonical", fullUrl);

    // OG
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", fullDesc, "property");
    setMeta("og:url", fullUrl, "property");
    setMeta("og:image", fullImg, "property");
    setMeta("og:type", type === "product" ? "product" : type === "article" ? "article" : "website", "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:locale", "uk_UA", "property");

    // Twitter
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", fullDesc);
    setMeta("twitter:image", fullImg);
    setMeta("twitter:card", "summary_large_image");

    // Breadcrumb schema
    if (breadcrumbs?.length) {
      setSchema("breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Головна", "item": BASE_URL },
          ...breadcrumbs.map((b, i) => ({
            "@type": "ListItem",
            "position": i + 2,
            "name": b.name,
            "item": `${BASE_URL}${b.url}`,
          })),
        ],
      });
    }

    // Product schema
    if (type === "product" && price !== undefined) {
      setSchema("product", {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": title,
        "description": fullDesc,
        "image": fullImg,
        "url": fullUrl,
        "brand": { "@type": "Brand", "name": SITE_NAME },
        "offers": {
          "@type": "Offer",
          "url": fullUrl,
          "priceCurrency": "UAH",
          "price": price,
          ...(originalPrice ? { "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] } : {}),
          "availability": availability
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          "seller": { "@type": "Organization", "name": SITE_NAME },
        },
      });
    }

    // Article schema
    if (type === "article") {
      setSchema("article", {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": fullDesc,
        "image": fullImg,
        "url": fullUrl,
        "datePublished": articleDate ?? new Date().toISOString(),
        "publisher": {
          "@type": "Organization",
          "name": SITE_NAME,
          "url": BASE_URL,
        },
      });
    }

    // FAQ schema
    if (faq?.length) {
      setSchema("faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faq.map(({ q, a }) => ({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": { "@type": "Answer", "text": a },
        })),
      });
    }

    return () => {
      ["breadcrumb", "product", "article", "faq"].forEach(id => {
        document.querySelector(`script[data-schema="${id}"]`)?.remove();
      });
    };
  }, [title, description, keywords, image, url, type, price, originalPrice, availability]);
};
