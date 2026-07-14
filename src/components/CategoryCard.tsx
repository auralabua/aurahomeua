import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Category } from "@/data/products";

/* ─── Premium minimalist illustrations ─────────────────────────────────── */

const PillowIllustration = () => (
  <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* shadow */}
    <ellipse cx="100" cy="143" rx="60" ry="5" fill="#8A6440" opacity="0.1"/>
    {/* main body — contoured orthopedic shape */}
    <path d="M22 85 Q22 46 58 36 Q76 30 100 32 Q124 30 142 36 Q178 46 178 85 Q178 118 142 128 Q124 134 100 134 Q76 134 58 128 Q22 118 22 85Z" fill="#E2C9A4"/>
    {/* inner surface */}
    <path d="M38 85 Q38 56 68 48 Q82 43 100 44 Q118 43 132 48 Q162 56 162 85 Q162 110 132 118 Q118 122 100 122 Q82 122 68 118 Q38 110 38 85Z" fill="#F0DEBB"/>
    {/* cervical depression */}
    <ellipse cx="100" cy="83" rx="30" ry="16" fill="#D4B080" opacity="0.32"/>
    {/* stitch line */}
    <path d="M40 85 Q100 75 160 85" stroke="#C4A070" stroke-width="1.2" stroke-dasharray="5,4" opacity="0.4"/>
    {/* left neck support */}
    <path d="M22 72 Q17 55 32 48 Q36 55 38 68Z" fill="#D8BB94" opacity="0.7"/>
  </svg>
);

const MatIllustration = () => (
  <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="100" cy="143" rx="56" ry="5" fill="#3D7A55" opacity="0.1"/>
    {/* mat base */}
    <rect x="26" y="18" width="148" height="112" rx="11" fill="#8EB88E"/>
    <rect x="34" y="26" width="132" height="96" rx="8" fill="#A4CCA4"/>
    {/* spike grid — perfectly aligned */}
    {[50, 68, 86, 104, 122, 140, 158].map((x) =>
      [36, 54, 72, 90, 106].map((y) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="5" fill="#2A5E3A"/>
          <circle cx={x} cy={y} r="3" fill="#3D7A55"/>
          <circle cx={x} cy={y} r="1.4" fill="#60A870"/>
        </g>
      ))
    )}
    <rect x="26" y="18" width="148" height="112" rx="11" stroke="#2A5E3A" stroke-width="1.5" opacity="0.25"/>
  </svg>
);

const BandageIllustration = () => (
  <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="100" cy="143" rx="40" ry="5" fill="#3D5A8A" opacity="0.1"/>
    {/* brace cylinder body */}
    <rect x="72" y="14" width="56" height="116" rx="28" fill="#B8C8E0"/>
    {/* highlight */}
    <rect x="78" y="20" width="28" height="48" rx="14" fill="#D0DCEE" opacity="0.75"/>
    {/* wrap bands */}
    {[36, 56, 76, 96].map((y, i) => (
      <g key={y}>
        <rect x="62" y={y} width="76" height="13" rx="6.5" fill="#3D5A8A" opacity={0.72 - i * 0.07}/>
        <rect x="62" y={y} width="76" height="5" rx="3" fill="#5A7AB0" opacity="0.4"/>
        <rect x="102" y={y + 2} width="28" height="8" rx="4" fill="#2A406A" opacity="0.35"/>
      </g>
    ))}
    <rect x="72" y="14" width="56" height="116" rx="28" stroke="#3D5A8A" stroke-width="1" opacity="0.25"/>
  </svg>
);

const MassagerIllustration = () => (
  <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="100" cy="143" rx="40" ry="5" fill="#8A4040" opacity="0.1"/>
    {/* handle */}
    <rect x="80" y="80" width="40" height="56" rx="12" fill="#B08878"/>
    {/* handle grip lines */}
    <line x1="84" y1="96" x2="116" y2="96" stroke="#907060" stroke-width="1.5" opacity="0.45"/>
    <line x1="84" y1="106" x2="116" y2="106" stroke="#907060" stroke-width="1.5" opacity="0.45"/>
    <line x1="84" y1="116" x2="116" y2="116" stroke="#907060" stroke-width="1.5" opacity="0.45"/>
    {/* neck */}
    <rect x="86" y="60" width="28" height="24" rx="8" fill="#C89888"/>
    {/* head */}
    <circle cx="100" cy="42" r="28" fill="#D8A898"/>
    <circle cx="100" cy="42" r="20" fill="#E8C0B0"/>
    <circle cx="100" cy="42" r="10" fill="#D0A090"/>
    <circle cx="100" cy="42" r="4" fill="#C09080"/>
    {/* power dot */}
    <circle cx="100" cy="73" r="5" fill="#8A4040" opacity="0.7"/>
    <circle cx="100" cy="73" r="3" fill="#C06050"/>
  </svg>
);

const BeautyIllustration = () => (
  <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="100" cy="143" rx="40" ry="5" fill="#9A5080" opacity="0.1"/>
    {/* face roller — two spheres on handle */}
    {/* handle */}
    <rect x="88" y="60" width="24" height="72" rx="12" fill="#D0A8C0"/>
    <rect x="92" y="66" width="10" height="38" rx="5" fill="#E0C0D4" opacity="0.55"/>
    {/* top roller */}
    <ellipse cx="100" cy="38" rx="24" ry="14" fill="#C890B8"/>
    <ellipse cx="100" cy="38" rx="18" ry="10" fill="#DEB0D0"/>
    <ellipse cx="100" cy="38" rx="8" ry="5" fill="#C488B0" opacity="0.6"/>
    {/* bottom roller */}
    <ellipse cx="100" cy="66" rx="18" ry="11" fill="#C890B8"/>
    <ellipse cx="100" cy="66" rx="13" ry="8" fill="#DEB0D0"/>
    <ellipse cx="100" cy="66" rx="6" ry="4" fill="#C488B0" opacity="0.6"/>
    {/* gems / accents */}
    <circle cx="86" cy="38" r="3.5" fill="#A06090" opacity="0.7"/>
    <circle cx="114" cy="38" r="3.5" fill="#A06090" opacity="0.7"/>
  </svg>
);

const ToysIllustration = () => (
  <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="100" cy="143" rx="56" ry="5" fill="#7A6A20" opacity="0.1"/>
    {/* cube left */}
    <rect x="24" y="70" width="54" height="54" rx="8" fill="#E8C840"/>
    <rect x="24" y="70" width="26" height="26" rx="5" fill="#F5D840" opacity="0.8"/>
    <rect x="50" y="70" width="28" height="26" rx="5" fill="#D0A820" opacity="0.6"/>
    <circle cx="51" cy="66" r="8" fill="#E8C840" stroke="#D0A820" stroke-width="1"/>
    <circle cx="79" cy="98" r="8" fill="#E8C840" stroke="#D0A820" stroke-width="1"/>
    {/* cube right */}
    <rect x="104" y="76" width="54" height="54" rx="8" fill="#E87840"/>
    <rect x="104" y="76" width="26" height="26" rx="5" fill="#F09050" opacity="0.8"/>
    <circle cx="131" cy="72" r="8" fill="#E87840" stroke="#C05820" stroke-width="1"/>
    <circle cx="103" cy="103" r="8" fill="#E87840" stroke="#C05820" stroke-width="1"/>
    {/* arch top */}
    <rect x="34" y="46" width="52" height="42" rx="8" fill="#40A870"/>
    <rect x="34" y="46" width="24" height="20" rx="5" fill="#58C888" opacity="0.8"/>
    <circle cx="60" cy="42" r="7" fill="#40A870" stroke="#208050" stroke-width="1"/>
  </svg>
);

const InsoleIllustration = () => (
  <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="100" cy="143" rx="68" ry="5" fill="#2A7070" opacity="0.1"/>
    {/* insole outline — foot profile */}
    <path d="M36 102 Q33 66 46 42 Q56 22 74 20 Q96 17 114 28 Q136 42 140 64 Q145 82 135 97 Q122 110 92 112 Q62 114 36 102Z" fill="#8AC4C0"/>
    <path d="M44 98 Q42 66 53 46 Q62 28 76 26 Q96 23 112 33 Q132 46 136 66 Q140 82 131 95 Q118 106 90 108 Q64 110 44 98Z" fill="#A8D8D4"/>
    {/* arch zone */}
    <path d="M52 90 Q50 64 60 52 Q68 40 80 38 Q96 36 108 44 Q122 55 124 72 Q126 86 116 95 Q102 104 82 104 Q60 104 52 90Z" fill="#C4E8E4" opacity="0.7"/>
    {/* arch highlight */}
    <ellipse cx="84" cy="48" rx="20" ry="10" fill="#7EBAB6" opacity="0.45"/>
    {/* arch support curve */}
    <path d="M54 78 Q78 68 122 76" stroke="#2A7070" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.35"/>
    <path d="M56 90 Q82 82 120 88" stroke="#2A7070" stroke-width="1.2" stroke-dasharray="4,3" opacity="0.25"/>
  </svg>
);

/* ─── Config ────────────────────────────────────────────────────────────── */

const landingUrlMap: Record<string, string> = {
  "ortopedychni-podushky":         "/ortopedychni-podushky",
  "masazhery":                     "/masazhery-dlya-spyny",
  "ortopedychni-masazhni-kylymky": "/masazhni-kylymky",
  "ortezy-i-bandazhi":             "/bandazhi-ta-ortezy",
  "ortopedychni-ustilky":          "/ortopedychni-ustilky-kuputy",
  "rozvyvaiuchi-ihrashky":         "/tovary-dlya-ditey-ortopedychni",
};

const categoryStyle: Record<string, {
  bg: string;
  accent: string;
  Illustration: () => JSX.Element;
}> = {
  "ortopedychni-podushky": {
    bg: "from-[#F7F0E6] to-[#EDE3D2]",
    accent: "#8A6440",
    Illustration: PillowIllustration,
  },
  "ortopedychni-masazhni-kylymky": {
    bg: "from-[#EAF3E8] to-[#D6EBD2]",
    accent: "#3D7A55",
    Illustration: MatIllustration,
  },
  "ortezy-i-bandazhi": {
    bg: "from-[#E8EEF7] to-[#D2DDEE]",
    accent: "#3D5A8A",
    Illustration: BandageIllustration,
  },
  "masazhery": {
    bg: "from-[#F5EAE8] to-[#EAD8D4]",
    accent: "#8A4040",
    Illustration: MassagerIllustration,
  },
  "tovary-dlia-krasy": {
    bg: "from-[#F5E8F2] to-[#EAD4E8]",
    accent: "#8A4070",
    Illustration: BeautyIllustration,
  },
  "rozvyvaiuchi-ihrashky": {
    bg: "from-[#F7F2E0] to-[#EDE8CC]",
    accent: "#7A6A20",
    Illustration: ToysIllustration,
  },
  "ortopedychni-ustilky": {
    bg: "from-[#E8F4F2] to-[#D2EAE8]",
    accent: "#2A7070",
    Illustration: InsoleIllustration,
  },
};

/* ─── Component ─────────────────────────────────────────────────────────── */

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const cfg = categoryStyle[category.id] ?? {
    bg: "from-[#F5F0EA] to-[#EDE3D5]",
    accent: "#3D7A55",
    Illustration: null as unknown as () => JSX.Element,
  };
  const { Illustration } = cfg;

  return (
    <Link
      to={landingUrlMap[category.id] ?? `/catalog?category=${category.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.bg} border border-white/80 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card active:scale-95`}
    >
      {/* Illustration */}
      <div className="relative overflow-hidden flex items-center justify-center" style={{ aspectRatio: "4/3" }}>
        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105 p-2">
          {Illustration ? <Illustration /> : (
            <category.icon
              className="h-12 w-12 sm:h-14 sm:w-14 opacity-25 mx-auto mt-6"
              style={{ color: cfg.accent }}
              strokeWidth={1.2}
            />
          )}
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col px-2.5 pb-3 sm:px-3 sm:pb-4 pt-1.5">
        <h3 className="font-semibold text-[11px] sm:text-[13px] leading-snug text-foreground line-clamp-2">
          {category.name}
        </h3>
        {category.description && (
          <p className="hidden sm:block text-[10px] text-muted-foreground mt-0.5 line-clamp-1 font-light">
            {category.description}
          </p>
        )}
        <div
          className="mt-1.5 flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 group-hover:gap-1.5"
          style={{ color: cfg.accent }}
        >
          <span className="sm:hidden">Перейти</span>
          <span className="hidden sm:inline">Переглянути</span>
          <ArrowRight size={9} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      {/* Decorative accent circle */}
      <div
        className="absolute -bottom-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full opacity-8 transition-all duration-500 group-hover:opacity-15 group-hover:scale-110"
        style={{ backgroundColor: cfg.accent }}
      />
    </Link>
  );
};
