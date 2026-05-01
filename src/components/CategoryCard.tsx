import { Link } from "react-router-dom";
import {
  BedDouble,
  Shield,
  Sparkles,
  Footprints,
  Home,
  Hand,
  Baby,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { Category } from "@/data/products";

type CategoryStyle = {
  icon: LucideIcon;
  gradient: string;
  accent: string;
  glow: string;
};

const categoryStyles: Record<string, CategoryStyle> = {
  "ortopedychni-podushky": {
    icon: BedDouble,
    gradient: "from-[#FBF4E8] via-[#F5E8D0] to-[#E8D4B0]",
    accent: "#A8794A",
    glow: "#C9956A",
  },
  "ortopedychni-masazhni-kylymky": {
    icon: Dumbbell,
    gradient: "from-[#F0F5EC] via-[#DDE8D5] to-[#BFD4B5]",
    accent: "#5C8454",
    glow: "#7AA870",
  },
  "ortezy-i-bandazhi": {
    icon: Shield,
    gradient: "from-[#EEF2F8] via-[#D8E0EE] to-[#B8C6DE]",
    accent: "#4A6391",
    glow: "#6B85B5",
  },
  "masazhery": {
    icon: Hand,
    gradient: "from-[#F8ECEC] via-[#EDD2D2] to-[#DDB0B0]",
    accent: "#8E4A4A",
    glow: "#B56B6B",
  },
  "tovary-dlia-krasy": {
    icon: Sparkles,
    gradient: "from-[#F8ECF2] via-[#EED2DF] to-[#E0B5C8]",
    accent: "#8E4A6E",
    glow: "#B56B92",
  },
  "rozvyvaiuchi-ihrashky": {
    icon: Baby,
    gradient: "from-[#FBF6E2] via-[#F2E8B8] to-[#E2D588]",
    accent: "#8A7530",
    glow: "#B89C45",
  },
  "ortopedychni-ustilky": {
    icon: Footprints,
    gradient: "from-[#E8F4F4] via-[#CFE5E5] to-[#A8CECE]",
    accent: "#3E7C7C",
    glow: "#5BA3A3",
  },
};

const fallbackStyle: CategoryStyle = {
  icon: Home,
  gradient: "from-[#F5F0EA] via-[#EDE3D5] to-[#DCC9AE]",
  accent: "#A8794A",
  glow: "#C9956A",
};

export const CategoryCard = ({ category }: { category: Category }) => {
  const style = categoryStyles[category.id] ?? fallbackStyle;
  const Icon = style.icon;

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-2 border border-white/60"
      style={{ aspectRatio: "3/4" }}
    >
      {/* Premium gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`} />

      {/* Decorative soft glow */}
      <div
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-80"
        style={{ backgroundColor: style.glow }}
      />
      <div
        className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-50"
        style={{ backgroundColor: style.accent }}
      />

      {/* Subtle grain / sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/10" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-5 text-center">
        {/* Icon medallion */}
        <div
          className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm ring-1 ring-white/80 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 mb-4"
          style={{
            boxShadow: `0 12px 30px -10px ${style.accent}, inset 0 1px 0 0 rgba(255,255,255,0.9)`,
          }}
        >
          <Icon size={40} strokeWidth={1.6} color={style.accent} />
        </div>

        <h3
          className="font-medium text-base leading-tight tracking-wide"
          style={{ color: style.accent }}
        >
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs mt-1.5 line-clamp-2 font-light text-foreground/65">
            {category.description}
          </p>
        )}

        {/* Hover accent underline */}
        <span
          className="block mt-3 h-[2px] w-0 group-hover:w-12 transition-all duration-500 rounded-full"
          style={{ backgroundColor: style.accent }}
        />
      </div>
    </Link>
  );
};
