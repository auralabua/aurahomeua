import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Category } from "@/data/products";

const categoryConfig: Record<string, { bg: string; accent: string; emoji: string }> = {
  "ortopedychni-podushky":         { bg: "from-[#F5EFE6] to-[#EDE3D5]", accent: "#8A6440", emoji: "🛏️" },
  "ortopedychni-masazhni-kylymky": { bg: "from-[#EAF2E8] to-[#D8EAD5]", accent: "#3D7A55", emoji: "🧘" },
  "ortezy-i-bandazhi":             { bg: "from-[#E8EDF5] to-[#D5DEEA]", accent: "#3D5A8A", emoji: "🦵" },
  "masazhery":                     { bg: "from-[#F0EAE8] to-[#E5D8D5]", accent: "#8A4040", emoji: "💆" },
  "tovary-dlia-krasy":             { bg: "from-[#F0E8F0] to-[#E5D5E5]", accent: "#8A4070", emoji: "✨" },
  "rozvyvaiuchi-ihrashky":         { bg: "from-[#F5F0E0] to-[#EAE5CC]", accent: "#7A6A20", emoji: "🧸" },
  "ortopedychni-ustilky":          { bg: "from-[#E8F2F0] to-[#D5EAE8]", accent: "#2A7070", emoji: "👟" },
};

export const CategoryCard = ({ category }: { category: Category }) => {
  const cfg = categoryConfig[category.id] ?? { bg: "from-[#F5F0EA] to-[#EDE3D5]", accent: "#3D7A55", emoji: "🌿" };
  const Icon = category.icon as LucideIcon | undefined;

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.bg} border border-white/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card active:scale-95`}
    >
      {/* Icon area */}
      <div className="flex items-center justify-center pt-4 pb-3 px-3 sm:pt-6 sm:pb-4 sm:px-4">
        <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-white/70 shadow-soft transition-transform duration-300 group-hover:scale-110">
          {Icon
            ? <Icon size={22} strokeWidth={1.4} style={{ color: cfg.accent }} className="sm:hidden" />
            : <span className="text-xl sm:hidden">{cfg.emoji}</span>
          }
          {Icon
            ? <Icon size={28} strokeWidth={1.4} style={{ color: cfg.accent }} className="hidden sm:block" />
            : <span className="text-2xl hidden sm:block">{cfg.emoji}</span>
          }
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col flex-1 px-2 pb-4 sm:px-4 sm:pb-5 text-center">
        <h3 className="font-medium text-[11px] sm:text-sm leading-snug text-foreground line-clamp-2">{category.name}</h3>
        {category.description && (
          <p className="hidden sm:block text-[11px] text-muted-foreground mt-1 line-clamp-2 font-light">{category.description}</p>
        )}
        <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider transition-all duration-300" style={{ color: cfg.accent }}>
          Перейти <ArrowRight size={8} className="transition-transform group-hover:translate-x-0.5 sm:hidden" />
          <span className="hidden sm:inline">Переглянути</span>
          <ArrowRight size={10} className="hidden sm:block transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Decorative circle */}
      <div
        className="absolute -bottom-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110"
        style={{ backgroundColor: cfg.accent }}
      />
    </Link>
  );
};
