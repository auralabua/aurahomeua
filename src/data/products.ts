import {
  type LucideIcon,
  BedDouble,
  Footprints,
  Activity,
  Zap,
  Sparkles,
  Blocks,
  Shield,
} from "lucide-react";

export type CategoryId =
  | "pillows"
  | "mats"
  | "braces"
  | "massagers"
  | "beauty"
  | "toys"
  | "insoles"
  | string;

export interface Category {
  id: CategoryId;
  name: string;
  icon: LucideIcon;
  description: string;
  parentId?: CategoryId | null;
}

// Default static categories (used as fallback). Live data comes from DB via useCategoriesAsLegacy().
export const categories: Category[] = [
  { id: "pillows", name: "Ортопедичні подушки", icon: BedDouble, description: "Здоровий сон і підтримка шиї" },
  { id: "mats", name: "Масажні килимки", icon: Activity, description: "Аплікатори та акупунктурні килимки" },
  { id: "braces", name: "Ортези і бандажі", icon: Shield, description: "Підтримка суглобів та спини" },
  { id: "massagers", name: "Масажери", icon: Zap, description: "Електричні та ручні масажери" },
  { id: "beauty", name: "Товари для краси", icon: Sparkles, description: "Догляд за обличчям і тілом" },
  { id: "toys", name: "Розвиваючі іграшки", icon: Blocks, description: "Для гармонійного розвитку дітей" },
  { id: "insoles", name: "Ортопедичні устілки", icon: Footprints, description: "Комфорт для ваших ніг" },
];

export interface Product {
  id: string;
  name: string;
  price: number;
  category: CategoryId;
  rating: number;
  reviews: number;
  badge?: "Хіт продажів" | "Новинка" | string;
  description: string;
  images: string[];
  vendor?: string;
  vendorCode?: string;
  available: boolean;
}

// Legacy static export removed — products now come from the database (see useProductsAsLegacy).
export const products: Product[] = [];

export const formatUAH = (price: number) =>
  new Intl.NumberFormat("uk-UA").format(price) + " ₴";
