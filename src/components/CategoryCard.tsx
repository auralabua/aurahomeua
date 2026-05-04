import { Link } from "react-router-dom";
import {
  BedDouble,
  Grid2X2,
  Bandage,
  Vibrate,
  Gem,
  ToyBrick,
  Footprints,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { Category } from "@/data/products";

type Cfg = { icon: LucideIcon; tone: string };

const categoryConfig: Record<string, Cfg> = {
  pillows: { icon: BedDouble, tone: "pillow" },
  mats: { icon: Grid2X2, tone: "mat" },
  braces: { icon: Bandage, tone: "brace" },
  massagers: { icon: Vibrate, tone: "massager" },
  beauty: { icon: Gem, tone: "beauty" },
  toys: { icon: ToyBrick, tone: "toy" },
  insoles: { icon: Footprints, tone: "insole" },
  "ortopedychni-podushky": { icon: BedDouble, tone: "pillow" },
  "ortopedychni-masazhni-kylymky": { icon: Grid2X2, tone: "mat" },
  "ortezy-i-bandazhi": { icon: Bandage, tone: "brace" },
  "masazhery": { icon: Vibrate, tone: "massager" },
  "tovary-dlia-krasy": { icon: Gem, tone: "beauty" },
  "rozvyvaiuchi-ihrashky": { icon: ToyBrick, tone: "toy" },
  "ortopedychni-ustilky": { icon: Footprints, tone: "insole" },
};

const categoryNameConfig: Array<[string, Cfg]> = [
  ["подуш", { icon: BedDouble, tone: "pillow" }],
  ["килим", { icon: Grid2X2, tone: "mat" }],
  ["ортез", { icon: Bandage, tone: "brace" }],
  ["бандаж", { icon: Bandage, tone: "brace" }],
  ["масаж", { icon: Vibrate, tone: "massager" }],
  ["крас", { icon: Gem, tone: "beauty" }],
  ["іграш", { icon: ToyBrick, tone: "toy" }],
  ["устіл", { icon: Footprints, tone: "insole" }],
];

const fallback: Cfg = { icon: Tag, tone: "default" };

const getCategoryConfig = (category: Category) =>
  categoryConfig[category.id] ??
  categoryNameConfig.find(([needle]) => category.name.toLowerCase().includes(needle))?.[1] ??
  fallback;

export const CategoryCard = ({ category }: { category: Category }) => {
  const cfg = getCategoryConfig(category);
  const Icon = cfg.icon;

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className={`category-card category-card-${cfg.tone} group relative flex flex-col overflow-hidden rounded-2xl p-5 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1.5 border`}
      style={{ aspectRatio: "3/4" }}
    >
      {/* Top accent line */}
      <div className="category-card-accent-line w-8 h-0.5 rounded-full mb-4 transition-all duration-300 group-hover:w-14" />

      {/* Icon */}
      <div className="category-card-icon-bg w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
        <Icon className="category-card-icon" size={31} strokeWidth={1.75} absoluteStrokeWidth />
      </div>

      {/* Text */}
      <div className="mt-auto pt-4">
        <p className="category-card-action text-[10px] font-medium uppercase tracking-widest mb-2">
          Переглянути →
        </p>
        <h3 className="font-light text-sm leading-snug text-foreground">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-light">
            {category.description}
          </p>
        )}
      </div>

      {/* Decorative circle */}
      <div className="category-card-mark absolute -bottom-10 -right-10 w-28 h-28 rounded-full transition-all duration-500 group-hover:scale-110" />
    </Link>
  );
};
