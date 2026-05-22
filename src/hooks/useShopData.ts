import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product, CategoryId, Category } from "@/data/products";
import {
  type LucideIcon,
  BedDouble,
  Footprints,
  Activity,
  Zap,
  Sparkles,
  Blocks,
  Shield,
  Tag,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  BedDouble,
  Activity,
  Shield,
  Zap,
  Sparkles,
  Blocks,
  Footprints,
};

const slugIconMap: Record<string, LucideIcon> = {
  "ortopedychni-podushky": BedDouble,
  "ortopedychni-masazhni-kylymky": Activity,
  "ortezy-i-bandazhi": Shield,
  "masazhery": Zap,
  "tovary-dlia-krasy": Sparkles,
  "rozvyvaiuchi-ihrashky": Blocks,
  "ortopedychni-ustilky": Footprints,
};

export interface DBCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  position: number;
  parent_id: string | null;
}

export interface DBProduct {
  id: string;
  legacy_id: string | null;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  images: string[];
  available: boolean;
  stock: number;
  badge: string | null;
  rating: number | null;
  reviews: number;
  vendor: string | null;
  vendor_code: string | null;
  position: number;
  original_price: number | null;
  parent_product_id: string | null;
  variant_label: string | null;
  is_parent: boolean | null;
}

export const useDBCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return data as DBCategory[];
    },
  });

const categoryNameOverrides: Record<string, string> = {
  "tovary-dlia-krasy": "Домашні девайси",
};

const categoryOrder = ["tovary-dlia-krasy"];

export const useCategoriesAsLegacy = () => {
  const q = useDBCategories();
  const data = q.data ?? [];
  const slugById = new Map(data.map((c) => [c.id, c.slug]));
  const categories: Category[] = data.map((c) => ({
    id: c.slug as CategoryId,
    name: categoryNameOverrides[c.slug] ?? c.name,
    icon: slugIconMap[c.slug] || (c.icon && iconMap[c.icon]) || Tag,
    description: c.description ?? "",
    parentId: c.parent_id ? ((slugById.get(c.parent_id) ?? null) as CategoryId | null) : null,
  })).sort((a, b) => {
    const ai = categoryOrder.indexOf(a.id);
    const bi = categoryOrder.indexOf(b.id);
    if (ai !== -1 && bi === -1) return -1;
    if (bi !== -1 && ai === -1) return 1;
    return 0;
  });
  return { ...q, categories };
};

export const useAllProductsAsLegacy = () => {
  const productsQ = useDBProducts();
  const catsQ = useDBCategories();
  const slugById = new Map((catsQ.data ?? []).map((c) => [c.id, c.slug]));
  const products: Product[] = (productsQ.data ?? []).map(p => ({
    id: p.id, // Use raw UUID for variant matching
    name: p.name,
    price: Number(p.price),
    category: (slugById.get(p.category_id ?? "") ?? "massagers") as CategoryId,
    rating: Number(p.rating ?? 5),
    reviews: p.reviews ?? 0,
    badge: (p.badge as Product["badge"]) || undefined,
    description: p.description ?? "",
    images: p.images ?? [],
    vendor: p.vendor ?? undefined,
    vendorCode: p.vendor_code ?? undefined,
    available: p.available,
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    parentProductId: p.parent_product_id ?? undefined,
    variantLabel: p.variant_label ?? undefined,
    isParent: p.is_parent ?? false,
  }));
  return { products, isLoading: productsQ.isLoading || catsQ.isLoading, isError: productsQ.isError || catsQ.isError };
};

export const useDBProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("position", { ascending: true })
        .limit(2000);
      if (error) throw error;
      return data as DBProduct[];
    },
  });

export const useProductsAsLegacy = () => {
  const productsQ = useDBProducts();
  const catsQ = useDBCategories();
  const slugById = new Map((catsQ.data ?? []).map((c) => [c.id, c.slug]));
  // Фільтруємо: показуємо тільки батьківські товари + самостійні (без варіантів)
  const filteredData = (productsQ.data ?? []).filter(p =>
    !p.parent_product_id || p.is_parent === true
  );
  const products: Product[] = filteredData.map((p) => ({
    id: p.legacy_id ?? p.id,
    name: p.name,
    price: Number(p.price),
    category: (slugById.get(p.category_id ?? "") ?? "massagers") as CategoryId,
    rating: Number(p.rating ?? 5),
    reviews: p.reviews ?? 0,
    badge: (p.badge as Product["badge"]) || undefined,
    description: p.description ?? "",
    images: p.images ?? [],
    vendor: p.vendor ?? undefined,
    vendorCode: p.vendor_code ?? undefined,
    available: p.available,
    originalPrice: p.original_price ? Number(p.original_price) : undefined,
    parentProductId: p.parent_product_id ?? undefined,
    variantLabel: p.variant_label ?? undefined,
    isParent: p.is_parent ?? false,
  }));
  return {
    products,
    isLoading: productsQ.isLoading || catsQ.isLoading,
    isError: productsQ.isError || catsQ.isError,
  };
};
