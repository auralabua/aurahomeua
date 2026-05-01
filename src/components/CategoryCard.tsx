import { Link } from "react-router-dom";
import { BedDouble, Activity, Shield, Zap, Sparkles, Blocks, Footprints, type LucideIcon } from "lucide-react";
import { Category } from "@/data/products";

type Cfg = { icon: LucideIcon; accent: string; bg: string; iconBg: string };

const categoryConfig: Record<string, Cfg> = {
  "ortopedychni-podushky":         { icon: BedDouble,  accent: "#A8794A", bg: "from-[#FBF7F2] to-[#EEE4D6]", iconBg: "#F0DECA" },
  "ortopedychni-masazhni-kylymky": { icon: Activity,   accent: "#5C8454", bg: "from-[#F2F7F2] to-[#D8EDD8]", iconBg: "#C8E8C8" },
  "ortezy-i-bandazhi":             { icon: Shield,     accent: "#4A6391", bg: "from-[#F2F4FA] to-[#D8E0F0]", iconBg: "#C8D4EC" },
  "masazhery":                     { icon: Zap,        accent: "#8E4A4A", bg: "from-[#FAF2F2] to-[#EED8D8]", iconBg: "#ECC8C8" },
  "tovary-dlia-krasy":             { icon: Sparkles,   accent: "#8E4A6E", bg: "from-[#FAF2F6] to-[#EED8EC]", iconBg: "#ECC8E0" },
  "rozvyvaiuchi-ihrashky":         { icon: Blocks,     accent: "#8A7530", bg: "from-[#FAF8EE] to-[#EEEACC]", iconBg: "#ECE0B0" },
  "ortopedychni-ustilky":          { icon: Footprints, accent: "#3E7C7C", bg: "from-[#F0F8F8] to-[#CCEAEA]", iconBg: "#B0E0E0" },
};

const fallback: Cfg = { icon: BedDouble, accent: "#C9956A", bg: "from-[#FBF7F2] to-[#EEE4D6]", iconBg: "#F0DECA" };

export const CategoryCard = ({ category }: { category: Category }) => {
  const cfg = categoryConfig[category.id] ?? fallback;
  const Icon = cfg.icon;

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.bg} p-5 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1.5 border border-white/80`}
      style={{ aspectRatio: "3/4" }}
    >
      {/* Top accent line */}
      <div
        className="w-8 h-0.5 rounded-full mb-4 transition-all duration-300 group-hover:w-14"
        style={{ backgroundColor: cfg.accent }}
      />

      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{ backgroundColor: cfg.iconBg }}
      >
        <Icon size={28} strokeWidth={1.5} style={{ color: cfg.accent }} />
      </div>

      {/* Text */}
      <div className="mt-auto pt-4">
        <p
          className="text-[10px] font-medium uppercase tracking-widest mb-2"
          style={{ color: cfg.accent }}
        >
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
      <div
        className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full opacity-15 transition-all duration-500 group-hover:opacity-25 group-hover:scale-110"
        style={{ backgroundColor: cfg.accent }}
      />
    </Link>
  );
};
