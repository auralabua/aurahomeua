import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Category } from "@/data/products";

const categoryConfig: Record<string, { bg: string; accent: string }> = {
  "ortopedychni-podushky":         { bg: "from-[#F5EFE6] to-[#EDE3D5]", accent: "#8A6440" },
  "ortopedychni-masazhni-kylymky": { bg: "from-[#EAF2E8] to-[#D8EAD5]", accent: "#3D7A55" },
  "ortezy-i-bandazhi":             { bg: "from-[#E8EDF5] to-[#D5DEEA]", accent: "#3D5A8A" },
  "masazhery":                     { bg: "from-[#F0EAE8] to-[#E5D8D5]", accent: "#8A4040" },
  "tovary-dlia-krasy":             { bg: "from-[#F0E8F0] to-[#E5D5E5]", accent: "#8A4070" },
  "rozvyvaiuchi-ihrashky":         { bg: "from-[#F5F0E0] to-[#EAE5CC]", accent: "#7A6A20" },
  "ortopedychni-ustilky":          { bg: "from-[#E8F2F0] to-[#D5EAE8]", accent: "#2A7070" },
};

export const CategoryCard = ({ category }: { category: Category }) => {
  const cfg = categoryConfig[category.id] ?? { bg: "from-[#F5F0EA] to-[#EDE3D5]", accent: "#3D7A55" };
  const Icon = category.icon as LucideIcon | undefined;

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.bg} p-5 border border-white/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card`}
      style={{ aspectRatio: "3/4" }}
    >
      {/* Top accent */}
      <div className="w-6 h-0.5 rounded-full transition-all duration-300 group-hover:w-10" style={{ backgroundColor: cfg.accent }} />

      {/* Icon */}
      {Icon && (
        <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/60 transition-transform duration-300 group-hover:scale-110">
          <Icon size={26} strokeWidth={1.4} style={{ color: cfg.accent }} />
        </div>
      )}

      {/* Text */}
      <div className="mt-auto">
        <p className="text-[9px] font-medium uppercase tracking-widest mb-1.5 flex items-center gap-1 transition-all duration-300" style={{ color: cfg.accent }}>
          Переглянути <ArrowRight size={9} />
        </p>
        <h3 className="font-light text-[13px] leading-snug text-foreground">{category.name}</h3>
        {category.description && (
          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 font-light">{category.description}</p>
        )}
      </div>

      {/* Decorative circle */}
      <div
        className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110"
        style={{ backgroundColor: cfg.accent }}
      />
    </Link>
  );
};
