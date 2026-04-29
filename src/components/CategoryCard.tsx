import { Link } from "react-router-dom";
import {
  BedDouble,
  Activity,
  Shield,
  Zap,
  Sparkles,
  Blocks,
  Footprints,
  Home,
  type LucideIcon,
} from "lucide-react";
import { Category } from "@/data/products";

type CategoryStyle = {
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  accent: string;
  ring: string;
};

const categoryStyles: Record<string, CategoryStyle> = {
  "ortopedychni-podushky": {
    icon: BedDouble,
    gradient: "from-[#F7F0E4] via-[#F1E6D2] to-[#E8D8BD]",
    iconBg: "from-[#FFFDF8] to-[#F2E4CC]",
    accent: "#A8794A",
    ring: "rgba(168,121,74,0.35)",
  },
  "ortopedychni-masazhni-kylymky": {
    icon: Activity,
    gradient: "from-[#EEF3EA] via-[#E0EBDB] to-[#CCDDC4]",
    iconBg: "from-[#FBFDF9] to-[#D8E7CF]",
    accent: "#5C8454",
    ring: "rgba(92,132,84,0.35)",
  },
  "ortezy-i-bandazhi": {
    icon: Shield,
    gradient: "from-[#ECF0F6] via-[#DCE3EE] to-[#C5D1E2]",
    iconBg: "from-[#FAFBFD] to-[#D2DCEC]",
    accent: "#4A6391",
    ring: "rgba(74,99,145,0.35)",
  },
  masazhery: {
    icon: Zap,
    gradient: "from-[#F6ECEC] via-[#EDD9D9] to-[#DEBFBF]",
    iconBg: "from-[#FDFAFA] to-[#EACFCF]",
    accent: "#8E4A4A",
    ring: "rgba(142,74,74,0.35)",
  },
  "tovary-dlia-krasy": {
    icon: Sparkles,
    gradient: "from-[#F6ECF1] via-[#ECD7E1] to-[#DDBDCC]",
    iconBg: "from-[#FDFAFB] to-[#EACDDA]",
    accent: "#8E4A6E",
    ring: "rgba(142,74,110,0.35)",
  },
  "rozvyvaiuchi-ihrashky": {
    icon: Blocks,
    gradient: "from-[#F6F1E2] via-[#EEE5C8] to-[#DCCD9F]",
    iconBg: "from-[#FDFBF3] to-[#E8DBB1]",
    accent: "#8A7530",
    ring: "rgba(138,117,48,0.35)",
  },
  "ortopedychni-ustilky": {
    icon: Footprints,
    gradient: "from-[#E8F2F2] via-[#D2E5E5] to-[#B6D4D4]",
    iconBg: "from-[#F8FCFC] to-[#C8DEDE]",
    accent: "#3E7C7C",
    ring: "rgba(62,124,124,0.35)",
  },
};

const fallbackStyle: CategoryStyle = {
  icon: Home,
  gradient: "from-[#F5F0EA] via-[#EDE3D5] to-[#DECBB1]",
  iconBg: "from-[#FFFDF9] to-[#EAD9BE]",
  accent: "#C9956A",
  ring: "rgba(201,149,106,0.35)",
};

export const CategoryCard = ({ category }: { category: Category }) => {
  const style = categoryStyles[category.id] ?? fallbackStyle;
  const Icon = style.icon;

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.gradient} shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-2 border border-white/60`}
      style={{ aspectRatio: "3/4" }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${style.ring}, transparent 65%)`,
        }}
      />

      {/* Decorative corner sheen */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/40 blur-2xl opacity-60" />

      <div className="relative h-full flex flex-col items-center justify-center px-4 py-6 text-center">
        {/* Icon medallion */}
        <div
          className={`relative mb-4 flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${style.iconBg} shadow-md ring-1 ring-white/80 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
          style={{ boxShadow: `0 8px 24px -8px ${style.ring}` }}
        >
          <Icon
            size={36}
            strokeWidth={1.6}
            color={style.accent}
            className="drop-shadow-sm"
          />
        </div>

        <h3
          className="font-medium text-sm md:text-base leading-tight tracking-wide"
          style={{ color: style.accent }}
        >
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-foreground/60 mt-1.5 line-clamp-2 font-light">
            {category.description}
          </p>
        )}

        {/* Hover underline accent */}
        <span
          className="absolute bottom-5 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-10 transition-all duration-500 rounded-full"
          style={{ backgroundColor: style.accent }}
        />
      </div>
    </Link>
  );
};
