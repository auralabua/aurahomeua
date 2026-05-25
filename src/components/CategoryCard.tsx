import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Category } from "@/data/products";

const categoryConfig: Record<string, {
  bg: string;
  accent: string;
  img: string;
}> = {
  "ortopedychni-podushky": {
    bg: "from-[#F5EFE6]/80 to-[#EDE3D5]/80",
    accent: "#8A6440",
    img: "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  "ortopedychni-masazhni-kylymky": {
    bg: "from-[#EAF2E8]/80 to-[#D8EAD5]/80",
    accent: "#3D7A55",
    img: "https://images.pexels.com/photos/6787202/pexels-photo-6787202.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  "ortezy-i-bandazhi": {
    bg: "from-[#E8EDF5]/80 to-[#D5DEEA]/80",
    accent: "#3D5A8A",
    img: "https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  "masazhery": {
    bg: "from-[#F0EAE8]/80 to-[#E5D8D5]/80",
    accent: "#8A4040",
    img: "https://images.pexels.com/photos/3865557/pexels-photo-3865557.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  "tovary-dlia-krasy": {
    bg: "from-[#F0E8F0]/80 to-[#E5D5E5]/80",
    accent: "#8A4070",
    img: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  "rozvyvaiuchi-ihrashky": {
    bg: "from-[#F5F0E0]/80 to-[#EAE5CC]/80",
    accent: "#7A6A20",
    img: "https://images.pexels.com/photos/3661353/pexels-photo-3661353.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
  "ortopedychni-ustilky": {
    bg: "from-[#E8F2F0]/80 to-[#D5EAE8]/80",
    accent: "#2A7070",
    img: "https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  },
};

export const CategoryCard = ({ category }: { category: Category }) => {
  const cfg = categoryConfig[category.id] ?? {
    bg: "from-[#F5F0EA]/80 to-[#EDE3D5]/80",
    accent: "#3D7A55",
    img: "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
  };

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card active:scale-95"
    >
      {/* Photo */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={cfg.img}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={e => {
            e.currentTarget.parentElement!.className = `relative overflow-hidden aspect-[4/3] bg-gradient-to-br ${cfg.bg}`;
            e.currentTarget.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Text */}
      <div className={`flex flex-col flex-1 px-3 py-3 sm:px-4 sm:py-4 bg-gradient-to-br ${cfg.bg}`}>
        <h3 className="font-medium text-xs sm:text-sm leading-snug text-foreground line-clamp-2">
          {category.name}
        </h3>
        {category.description && (
          <p className="hidden sm:block text-[11px] text-muted-foreground mt-1 line-clamp-1 font-light">
            {category.description}
          </p>
        )}
        <div
          className="mt-1.5 sm:mt-2 flex items-center gap-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider transition-all duration-300"
          style={{ color: cfg.accent }}
        >
          <span className="sm:hidden">Перейти</span>
          <span className="hidden sm:inline">Переглянути</span>
          <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
};
