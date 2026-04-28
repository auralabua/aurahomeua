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

export interface DBCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  position: number;
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

export const useCategoriesAsLegacy = () => {
  const q = useDBCategories();
  const categories: Category[] = (q.data ?? []).map((c) => ({
    id: c.slug as CategoryId,
    name: c.name,
    icon: (c.icon && iconMap[c.icon]) || Tag,
    description: c.description ?? "",
  }));
  return { ...q, categories };
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

  const products: Product[] = (productsQ.data ?? []).map((p) => ({
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
  }));

  return {
    products,
    isLoading: productsQ.isLoading || catsQ.isLoading,
    isError: productsQ.isError || catsQ.isError,
  };
};
