import { Link } from "react-router-dom";
import {
  BedDouble, Activity, Shield, Zap, Sparkles, Blocks, Footprints,
  type LucideIcon,
} from "lucide-react";
import { Category } from "@/data/products";

type CategoryStyle = {
  icon: LucideIcon;
  image: string;
  accent: string;
  bg: string;
};

const categoryStyles: Record<string, CategoryStyle> = {
  "ortopedychni-podushky": {
    icon: BedDouble,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80&auto=format&fit=crop",
    accent: "#A8794A",
    bg: "from-[#F5EFE6] to-[#E8DDD0]",
  },
  "ortopedychni-masazhni-kylymky": {
    icon: Activity,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
    accent: "#5C8454",
    bg: "from-[#EAF0E8] to-[#D5E5D0]",
  },
  "ortezy-i-bandazhi": {
    icon: Shield,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop",
    accent: "#4A6391",
    bg: "from-[#E8EDF5] to-[#D0DAE8]",
  },
  "masazhery": {
    icon: Zap,
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&q=80&auto=format&fit=crop",
    accent: "#8E4A4A",
    bg: "from-[#F5E8E8] to-[#E8D0D0]",
  },
  "tovary-dlia-krasy": {
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&auto=format&fit=crop",
    accent: "#8E4A6E",
    bg: "from-[#F5EAF0] to-[#E8D0DF]",
  },
  "rozvyvaiuchi-ihrashky": {
    icon: Blocks,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80&auto=format&fit=crop",
    accent: "#8A7530",
    bg: "from-[#F5F0E0] to-[#EDE5CC]",
  },
  "ortopedychni-ustilky": {
    icon: Footprints,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop",
    accent: "#3E7C7C",
    bg: "from-[#E8F5F5] to-[#D0E8E8]",
  },
};

export const CategoryCard = ({ category }: { category: Category }) => {
  const style = categoryStyles[category.id] ?? {
    icon: BedDouble,
    image: "",
    accent: "#C9956A",
    bg: "from-[#F5F0EA] to-[#EDE3D5]",
  };
  const Icon = style.icon;

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-2 border border-white/40"
      style={{ aspectRatio: "3/4" }}
    >
      {/* Background — фото або градієнт */}
      {style.image ? (
        <img
          src={style.image}
          alt={category.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : null}

      {/* Fallback gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${style.bg}`} style={{ zIndex: style.image ? -1 : 0 }} />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

      {/* Hover accent glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 30%, ${style.accent}44, transparent 65%)` }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-4">
        {/* Icon */}
        <div
          className="absolute top-4 left-4 flex items-center justify-center w-11 h-11 rounded-xl bg-white/95 backdrop-blur-sm shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{ boxShadow: `0 8px 20px -8px ${style.accent}` }}
        >
          <Icon size={22} strokeWidth={1.8} color={style.accent} />
        </div>

        <h3 className="font-medium text-base leading-tight text-white drop-shadow-md">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-white/75 mt-1.5 line-clamp-2 font-light">
            {category.description}
          </p>
        )}
        <span
          className="block mt-2 h-[2px] w-0 group-hover:w-12 transition-all duration-500 rounded-full"
          style={{ backgroundColor: style.accent }}
        />
      </div>
    </Link>
  );
};
