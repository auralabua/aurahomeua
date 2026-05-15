import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "product";
  price?: number;
  availability?: boolean;
}

const BASE_URL = "https://aurahomeua.lovable.app";
const DEFAULT_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/f34d19b8-9d8e-42b9-ac60-195d4ee4d61e";
const SITE_NAME = "Aura Well";

export const useSEO = ({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  price,
  availability,
}: SEOProps = {}) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Товари для здоровʼя, ортопедії та комфорту вдома`;
    const fullDesc = description ?? "Aura Well — інтернет-магазин товарів для здоровʼя: ортопедичні подушки, устілки, бандажі, масажери та аплікатори. Доставка по Україні.";
    const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

    // Basic
    document.title = fullTitle;
    setMeta("description", fullDesc);
    if (keywords) setMeta("keywords", keywords);
    setLink("canonical", fullUrl);

    // Open Graph
    setOG("title", fullTitle);
    setOG("description", fullDesc);
    setOG("image", image);
    setOG("url", fullUrl);
    setOG("type", type);
    setOG("site_name", SITE_NAME);
    setOG("locale", "uk_UA");

    // Twitter
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", fullDesc);
    setMeta("twitter:image", image);

    // Product schema
    if (type === "product" && price !== undefined) {
      setJsonLd("product-schema", {
        "@context": "https://schema.org",
        "@type": "Product",
        name: title,
        description: fullDesc,
        image,
        offers: {
          "@type": "Offer",
          price,
          priceCurrency: "UAH",
          availability: availability
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: fullUrl,
          seller: { "@type": "Organization", name: SITE_NAME },
        },
      });
    }

    return () => {
      // Reset on unmount
      document.title = `${SITE_NAME} — Товари для здоровʼя, ортопедії та комфорту вдома`;
    };
  }, [title, description, keywords, image, url, type, price, availability]);
};

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
  el.content = content;
}

function setOG(property: string, content: string) {
  let el = document.querySelector(`meta[property="og:${property}"]`) as HTMLMetaElement;
  if (!el) { el = document.createElement("meta"); el.setAttribute("property", `og:${property}`); document.head.appendChild(el); }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!el) { el = document.createElement("link"); el.rel = rel; document.head.appendChild(el); }
  el.href = href;
}

function setJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement;
  if (!el) { el = document.createElement("script"); el.type = "application/ld+json"; el.id = id; document.head.appendChild(el); }
  el.textContent = JSON.stringify(data);
}
