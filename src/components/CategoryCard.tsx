import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Category } from "@/data/products";
import { OptimizedImage } from "@/components/OptimizedImage";

const categoryStyle: Record<string, { bg: string; accent: string }> = {
  "ortopedychni-podushky":          { bg: "from-[#F5EFE6] to-[#EDE3D5]", accent: "#8A6440" },
  "ortopedychni-masazhni-kylymky":  { bg: "from-[#EAF2E8] to-[#D8EAD5]", accent: "#3D7A55" },
  "ortezy-i-bandazhi":              { bg: "from-[#E8EDF5] to-[#D5DEEA]", accent: "#3D5A8A" },
  "masazhery":                      { bg: "from-[#F0EAE8] to-[#E5D8D5]", accent: "#8A4040" },
  "tovary-dlia-krasy":              { bg: "from-[#F0E8F0] to-[#E5D5E5]", accent: "#8A4070" },
  "rozvyvaiuchi-ihrashky":          { bg: "from-[#F5F0E0] to-[#EAE5CC]", accent: "#7A6A20" },
  "ortopedychni-ustilky":           { bg: "from-[#E8F2F0] to-[#D5EAE8]", accent: "#2A7070" },
};

interface CategoryCardProps {
  category: Category;
  imageUrl?: string;
}

export const CategoryCard = ({ category, imageUrl }: CategoryCardProps) => {
  const cfg = categoryStyle[category.id] ?? { bg: "from-[#F5F0EA] to-[#EDE3D5]", accent: "#3D7A55" };
  const Icon = category.icon;

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.bg} border border-white/70 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card active:scale-95`}
    >
      {/* Photo or icon fallback */}
      <div className="relative overflow-hidden flex items-center justify-center bg-white/50" style={{ aspectRatio: "4/3" }}>
        {imageUrl ? (
          <OptimizedImage
            src={imageUrl}
            alt={category.name}
            className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 200px"
            quality={80}
          />
        ) : (
          <Icon
            className="h-12 w-12 sm:h-14 sm:w-14 opacity-30 transition-transform duration-300 group-hover:scale-105"
            style={{ color: cfg.accent }}
            strokeWidth={1.2}
          />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col px-2 pb-3 sm:px-3 sm:pb-4 pt-2">
        <h3 className="font-medium text-[11px] sm:text-sm leading-snug text-foreground line-clamp-2">
          {category.name}
        </h3>
        {category.description && (
          <p className="hidden sm:block text-[10px] text-muted-foreground mt-0.5 line-clamp-1 font-light">
            {category.description}
          </p>
        )}
        <div
          className="mt-1.5 flex items-center gap-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider transition-all duration-300"
          style={{ color: cfg.accent }}
        >
          <span className="sm:hidden">Перейти</span>
          <span className="hidden sm:inline">Переглянути</span>
          <ArrowRight size={9} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Decorative circle */}
      <div
        className="absolute -bottom-5 -right-5 w-14 h-14 sm:w-16 sm:h-16 rounded-full opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-110"
        style={{ backgroundColor: cfg.accent }}
      />
    </Link>
  );
};
