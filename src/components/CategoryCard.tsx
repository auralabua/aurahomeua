import { Link } from "react-router-dom";
import { Category } from "@/data/products";

const categoryConfig: Record<string, {
  accent: string;
  bg: string;
  iconBg: string;
  svg: string;
}> = {
  "ortopedychni-podushky": {
    accent: "#A8794A",
    bg: "from-[#FBF7F2] to-[#F0E8DC]",
    iconBg: "#F0E0CC",
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="16" width="36" height="20" rx="10" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M6 26h36" stroke="currentColor" stroke-width="2"/>
      <path d="M14 16v20M34 16v20" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 3"/>
    </svg>`,
  },
  "ortopedychni-masazhni-kylymky": {
    accent: "#5C8454",
    bg: "from-[#F2F7F2] to-[#DCF0DC]",
    iconBg: "#CCE8CC",
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="12" width="36" height="28" rx="4" stroke="currentColor" stroke-width="2"/>
      <circle cx="14" cy="20" r="2" fill="currentColor"/>
      <circle cx="24" cy="20" r="2" fill="currentColor"/>
      <circle cx="34" cy="20" r="2" fill="currentColor"/>
      <circle cx="14" cy="28" r="2" fill="currentColor"/>
      <circle cx="24" cy="28" r="2" fill="currentColor"/>
      <circle cx="34" cy="28" r="2" fill="currentColor"/>
      <circle cx="14" cy="34" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="24" cy="34" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="34" cy="34" r="2" fill="currentColor" opacity="0.4"/>
    </svg>`,
  },
  "ortezy-i-bandazhi": {
    accent: "#4A6391",
    bg: "from-[#F2F4F8] to-[#DCE4F0]",
    iconBg: "#CCD8EC",
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 8C16 8 10 14 10 22C10 30 16 40 24 40C32 40 38 30 38 22C38 14 32 8 24 8Z" stroke="currentColor" stroke-width="2"/>
      <path d="M16 22C16 22 18 26 24 26C30 26 32 22 32 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M14 18h20M14 30h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    </svg>`,
  },
  "masazhery": {
    accent: "#8E4A4A",
    bg: "from-[#FAF2F2] to-[#F0DCDC]",
    iconBg: "#ECCCC",
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="28" rx="10" ry="14" stroke="currentColor" stroke-width="2"/>
      <path d="M24 14V8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M18 10l2 4M30 10l-2 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      <path d="M18 24c0 0 2 4 6 4s6-4 6-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
  },
  "tovary-dlia-krasy": {
    accent: "#8E4A6E",
    bg: "from-[#FAF2F6] to-[#F0DCEC]",
    iconBg: "#ECCCE4",
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 8h8v6l4 4v20H16V18l4-4V8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M16 22h16" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="24" cy="30" r="4" stroke="currentColor" stroke-width="1.5"/>
      <path d="M22 8h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
  },
  "rozvyvaiuchi-ihrashky": {
    accent: "#8A7530",
    bg: "from-[#FAF8F0] to-[#F0EAD0]",
    iconBg: "#ECE0B8",
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="14" height="14" rx="3" stroke="currentColor" stroke-width="2"/>
      <circle cx="34" cy="27" r="8" stroke="currentColor" stroke-width="2"/>
      <path d="M15 20V16a4 4 0 014-4h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="28" cy="27" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="34" cy="21" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="40" cy="27" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="34" cy="33" r="2" fill="currentColor" opacity="0.4"/>
    </svg>`,
  },
  "ortopedychni-ustilky": {
    accent: "#3E7C7C",
    bg: "from-[#F0F8F8] to-[#D0ECEC]",
    iconBg: "#B8E4E4",
    svg: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 34C10 34 14 18 24 16C34 14 38 34 38 34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M10 34h28" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M16 34V30M24 34V26M32 34V30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    </svg>`,
  },
};

export const CategoryCard = ({ category }: { category: Category }) => {
  const cfg = categoryConfig[category.id] ?? {
    accent: "#C9956A",
    bg: "from-[#FBF7F2] to-[#F0E8DC]",
    iconBg: "#F0E0CC",
    svg: `<svg viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" stroke-width="2"/></svg>`,
  };

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.bg} p-5 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1.5 border border-white/80`}
      style={{ aspectRatio: "3/4" }}
    >
      {/* Top accent line */}
      <div
        className="w-8 h-0.5 rounded-full transition-all duration-300 group-hover:w-14"
        style={{ backgroundColor: cfg.accent }}
      />

      {/* Icon */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: cfg.iconBg, color: cfg.accent }}
        dangerouslySetInnerHTML={{ __html: cfg.svg.replace('<svg ', '<svg width="36" height="36" ') }}
      />

      {/* Text */}
      <div className="mt-auto">
        <p
          className="text-[10px] font-medium uppercase tracking-widest mb-2 transition-opacity duration-300"
          style={{ color: cfg.accent }}
        >
          Переглянути →
        </p>
        <h3 className="font-light text-sm leading-snug text-foreground">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 font-light opacity-80">
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
