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

import imgPillows from "@/assets/cat-pillows.jpg";
import imgMats from "@/assets/cat-mats.jpg";
import imgBraces from "@/assets/cat-braces.jpg";
import imgMassagers from "@/assets/cat-massagers.jpg";
import imgBeauty from "@/assets/cat-beauty.jpg";
import imgToys from "@/assets/cat-toys.jpg";
import imgInsoles from "@/assets/cat-insoles.jpg";

type CategoryStyle = {
  icon: LucideIcon;
  image: string;
  accent: string;
};

const categoryStyles: Record<string, CategoryStyle> = {
  "ortopedychni-podushky":         { icon: BedDouble,  image: imgPillows,   accent: "#A8794A" },
  "ortopedychni-masazhni-kylymky": { icon: Activity,   image: imgMats,      accent: "#5C8454" },
  "ortezy-i-bandazhi":             { icon: Shield,     image: imgBraces,    accent: "#4A6391" },
  "masazhery":                     { icon: Zap,        image: imgMassagers, accent: "#8E4A4A" },
  "tovary-dlia-krasy":             { icon: Sparkles,   image: imgBeauty,    accent: "#8E4A6E" },
  "rozvyvaiuchi-ihrashky":         { icon: Blocks,     image: imgToys,      accent: "#8A7530" },
  "ortopedychni-ustilky":          { icon: Footprints, image: imgInsoles,   accent: "#3E7C7C" },
};

const fallbackStyle: CategoryStyle = {
  icon: Home,
  image: imgPillows,
  accent: "#C9956A",
};

export const CategoryCard = ({ category }: { category: Category }) => {
  const style = categoryStyles[category.id] ?? fallbackStyle;
  const Icon = style.icon;

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-2 border border-white/40"
      style={{ aspectRatio: "3/4" }}
    >
      {/* Background photo */}
      <img
        src={style.image}
        alt={category.name}
        loading="lazy"
        width={768}
        height={1024}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Premium dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

      {/* Accent glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${style.accent}55, transparent 65%)`,
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-4">
        {/* Icon medallion */}
        <div
          className="absolute top-4 left-4 flex items-center justify-center w-11 h-11 rounded-xl bg-white/95 backdrop-blur-sm shadow-md ring-1 ring-white/60 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
          style={{ boxShadow: `0 8px 20px -8px ${style.accent}` }}
        >
          <Icon size={22} strokeWidth={1.8} color={style.accent} />
        </div>

        <h3 className="font-medium text-base leading-tight text-white drop-shadow-md tracking-wide">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-white/80 mt-1.5 line-clamp-2 font-light">
            {category.description}
          </p>
        )}

        {/* Hover accent underline */}
        <span
          className="block mt-2 h-[2px] w-0 group-hover:w-12 transition-all duration-500 rounded-full"
          style={{ backgroundColor: style.accent }}
        />
      </div>
    </Link>
  );
};
