import { useEffect } from "react";
import { vercelImg } from "@/components/OptimizedImage";

const BASE_URL = import.meta.env.VITE_SITE_URL || "https://bodyhome.com.ua";
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

const removeMeta = (name: string, attr = "name") => {
  document.querySelector(`meta[${attr}="${name}"]`)?.remove();
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
  images?: string[];           // Multiple product images for schema
  url?: string;
  type?: "website" | "product" | "article";
  price?: number;
  originalPrice?: number;
  availability?: boolean;
  sku?: string;                // Vendor code / article number
  aggregateRating?: {          // Product rating for rich snippets
    ratingValue: number;
    reviewCount: number;
  };
  breadcrumbs?: { name: string; url: string }[];
  faq?: { q: string; a: string }[];
  articleDate?: string;
  noindex?: boolean;
}

export const useSEO = ({
  title,
  description,
  keywords,
  image = DEFAULT_IMG,
  images,
  url = "/",
  type = "website",
  price,
  originalPrice,
  availability = true,
  sku,
  aggregateRating,
  breadcrumbs,
  faq,
  articleDate,
  noindex = false,
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
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");

    // Preload product hero image for LCP
    if (type === "product" && image && image !== DEFAULT_IMG) {
      const preloadHref = vercelImg(image, 960, 85);
      let preload = document.querySelector(`link[rel="preload"][data-product-img]`) as HTMLLinkElement | null;
      if (!preload) {
        preload = document.createElement("link") as HTMLLinkElement;
        preload.rel = "preload";
        preload.setAttribute("as", "image");
        preload.setAttribute("data-product-img", "1");
        document.head.appendChild(preload);
      }
      preload.href = preloadHref;
    } else {
      document.querySelector(`link[rel="preload"][data-product-img]`)?.remove();
    }

    // OG
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", fullDesc, "property");
    setMeta("og:url", fullUrl, "property");
    setMeta("og:image", fullImg, "property");
    setMeta("og:type", type === "product" ? "product" : type === "article" ? "article" : "website", "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:locale", "uk_UA", "property");

    // Product-specific OG tags (used by Facebook Shops, Pinterest, etc.)
    if (type === "product" && price !== undefined) {
      setMeta("product:price:amount", String(price), "property");
      setMeta("product:price:currency", "UAH", "property");
      setMeta("product:availability", availability ? "in stock" : "out of stock", "property");
      if (sku) setMeta("product:retailer_item_id", sku, "property");
    } else {
      removeMeta("product:price:amount", "property");
      removeMeta("product:price:currency", "property");
      removeMeta("product:availability", "property");
      removeMeta("product:retailer_item_id", "property");
    }

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

    // Product schema (rich snippet with rating)
    if (type === "product" && price !== undefined) {
      // Collect all product images for schema
      const schemaImages = images?.length
        ? images.map(img => img.startsWith("http") ? img : `${BASE_URL}${img}`)
        : [fullImg];

      const priceValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];

      setSchema("product", {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": title,
        "description": fullDesc,
        "image": schemaImages.length === 1 ? schemaImages[0] : schemaImages,
        "url": fullUrl,
        ...(sku ? { "sku": sku, "mpn": sku } : {}),
        "brand": { "@type": "Brand", "name": SITE_NAME },
        // AggregateRating — enables gold stars in Google search results
        ...(aggregateRating && aggregateRating.reviewCount > 0
          ? {
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": aggregateRating.ratingValue.toFixed(1),
                "reviewCount": aggregateRating.reviewCount,
                "bestRating": "5",
                "worstRating": "1",
              },
            }
          : {}),
        "offers": {
          "@type": "Offer",
          "url": fullUrl,
          "priceCurrency": "UAH",
          "price": price,
          "priceValidUntil": priceValidUntil,
          ...(originalPrice && originalPrice > price
            ? {
                "priceSpecification": {
                  "@type": "UnitPriceSpecification",
                  "price": price,
                  "priceCurrency": "UAH",
                },
              }
            : {}),
          "availability": availability
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "currency": "UAH",
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "UA",
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 0,
                "maxValue": 1,
                "unitCode": "DAY",
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 1,
                "maxValue": 3,
                "unitCode": "DAY",
              },
            },
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "UA",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 14,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn",
          },
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
      document.querySelector(`link[rel="preload"][data-product-img]`)?.remove();
    };
  }, [title, description, keywords, image, images, url, type, price, originalPrice, availability, sku, aggregateRating, breadcrumbs, faq, articleDate]);
};
