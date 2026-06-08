import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Category } from "@/data/products";

const PillowIllustration = () => (
  <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="122" rx="55" ry="7" fill="#C9A87A" opacity="0.2"/>
    <rect x="25" y="35" width="130" height="80" rx="30" fill="#DEC5A8"/>
    <rect x="35" y="43" width="110" height="64" rx="24" fill="#EDD8C0"/>
    <rect x="45" y="48" width="90" height="30" rx="16" fill="#F5E8D5" opacity="0.8"/>
    <ellipse cx="90" cy="75" rx="28" ry="12" fill="#D4B090" opacity="0.35"/>
    <line x1="35" y1="75" x2="145" y2="75" stroke="#C9A87A" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>
    <rect x="27" y="37" width="126" height="76" rx="28" fill="none" stroke="#C9A87A" stroke-width="1" stroke-dasharray="3,5" opacity="0.35"/>
    <rect x="60" y="92" width="60" height="8" rx="4" fill="#C9A87A" opacity="0.2"/>
  </svg>
);

const MatIllustration = () => (
  <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="122" rx="52" ry="7" fill="#3D7A55" opacity="0.15"/>
    <rect x="28" y="18" width="124" height="98" rx="10" fill="#A8CCA0"/>
    <rect x="34" y="24" width="112" height="86" rx="7" fill="#B8D8B0"/>
    {[40,56,72,88,104,120,136].map((x,i) => [28,46,64,82,100].map((y,j) => (
      <g key={`${i}-${j}`}>
        <circle cx={x} cy={y} r="5" fill="#3D7A55"/>
        <circle cx={x} cy={y} r="3" fill="#5A9E6A"/>
        <circle cx={x} cy={y} r="1.2" fill="#80C090"/>
      </g>
    )))}
    <rect x="28" y="18" width="124" height="98" rx="10" fill="none" stroke="#3D7A55" stroke-width="1.5" opacity="0.4"/>
  </svg>
);

const BandageIllustration = () => (
  <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="122" rx="38" ry="6" fill="#3D5A8A" opacity="0.15"/>
    <rect x="68" y="12" width="44" height="108" rx="22" fill="#C0CEDE"/>
    <rect x="74" y="18" width="22" height="45" rx="11" fill="#D8E4F0" opacity="0.8"/>
    {[38,56,74,92].map((y,i) => (
      <g key={i}>
        <rect x="58" y={y} width="64" height="12" rx="6" fill="#3D5A8A" opacity={0.7 - i*0.08}/>
        <rect x="58" y={y} width="64" height="4" rx="3" fill="#6080B0" opacity="0.4"/>
        <rect x="96" y={y+2} width="22" height="7" rx="3" fill="#2A4070" opacity="0.4"/>
      </g>
    ))}
    <rect x="68" y="12" width="44" height="108" rx="22" fill="none" stroke="#3D5A8A" stroke-width="1" opacity="0.3"/>
  </svg>
);

const MassagerIllustration = () => (
  <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="122" rx="38" ry="6" fill="#8A4040" opacity="0.15"/>
    <rect x="66" y="38" width="48" height="70" rx="14" fill="#C89888"/>
    <rect x="72" y="44" width="20" height="32" rx="8" fill="#E0B0A0" opacity="0.65"/>
    <rect x="72" y="82" width="36" height="42" rx="10" fill="#B08070"/>
    <line x1="76" y1="90" x2="104" y2="90" stroke="#907060" stroke-width="1.5" opacity="0.5"/>
    <line x1="76" y1="98" x2="104" y2="98" stroke="#907060" stroke-width="1.5" opacity="0.5"/>
    <line x1="76" y1="106" x2="104" y2="106" stroke="#907060" stroke-width="1.5" opacity="0.5"/>
    <circle cx="90" cy="30" r="18" fill="#D8A898"/>
    <circle cx="90" cy="30" r="12" fill="#ECC0B0"/>
    <circle cx="90" cy="30" r="6" fill="#D8A898"/>
    <circle cx="90" cy="30" r="2.5" fill="#C09080"/>
    <circle cx="90" cy="66" r="6" fill="#8A4040" opacity="0.65"/>
    <circle cx="90" cy="66" r="3.5" fill="#C06050"/>
    <ellipse cx="90" cy="122" rx="30" ry="5" fill="#8A4040" opacity="0.12"/>
  </svg>
);

const BeautyIllustration = () => (
  <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="122" rx="38" ry="6" fill="#8A4070" opacity="0.15"/>
    <rect x="62" y="35" width="56" height="85" rx="28" fill="#C890B8"/>
    <rect x="68" y="42" width="22" height="42" rx="12" fill="#E0B8D5" opacity="0.65"/>
    <ellipse cx="90" cy="30" rx="26" ry="17" fill="#DAAAC8"/>
    <ellipse cx="90" cy="30" rx="18" ry="11" fill="#EEC8E0"/>
    <circle cx="80" cy="28" r="3" fill="#FF80B0" opacity="0.85"/>
    <circle cx="90" cy="25" r="3" fill="#FF80B0" opacity="0.85"/>
    <circle cx="100" cy="28" r="3" fill="#FF80B0" opacity="0.85"/>
    <circle cx="85" cy="34" r="3" fill="#C060A0" opacity="0.65"/>
    <circle cx="95" cy="34" r="3" fill="#C060A0" opacity="0.65"/>
    <circle cx="78" cy="100" r="7" fill="#B880B0" opacity="0.7"/>
    <circle cx="102" cy="100" r="7" fill="#B880B0" opacity="0.7"/>
    <rect x="84" y="110" width="12" height="18" rx="6" fill="#A870A8" opacity="0.65"/>
  </svg>
);

const ToysIllustration = () => (
  <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="122" rx="52" ry="7" fill="#7A6A20" opacity="0.15"/>
    <rect x="30" y="30" width="52" height="52" rx="8" fill="#E8C840"/>
    <rect x="30" y="30" width="25" height="25" rx="5" fill="#F0D840" opacity="0.8"/>
    <rect x="57" y="30" width="25" height="25" rx="5" fill="#D4B020" opacity="0.6"/>
    <circle cx="56" cy="26" r="7" fill="#E8C840" stroke="#D4B020" stroke-width="1"/>
    <circle cx="84" cy="56" r="7" fill="#E8C840" stroke="#D4B020" stroke-width="1"/>
    <rect x="96" y="68" width="50" height="50" rx="8" fill="#E07840"/>
    <rect x="96" y="68" width="24" height="24" rx="5" fill="#F08840" opacity="0.8"/>
    <circle cx="121" cy="64" r="7" fill="#E07840" stroke="#C06020" stroke-width="1"/>
    <circle cx="93" cy="93" r="7" fill="#E07840" stroke="#C06020" stroke-width="1"/>
    <rect x="28" y="80" width="48" height="38" rx="8" fill="#40A870"/>
    <rect x="28" y="80" width="22" height="18" rx="4" fill="#50C080" opacity="0.8"/>
    <circle cx="52" cy="76" r="6" fill="#40A870" stroke="#208050" stroke-width="1"/>
  </svg>
);

const InsoleIllustration = () => (
  <svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="90" cy="120" rx="68" ry="8" fill="#2A7070" opacity="0.15"/>
    <path d="M 38 95 Q 35 60 48 38 Q 58 20 75 18 Q 95 15 110 25 Q 130 38 135 58 Q 140 75 130 90 Q 118 102 90 105 Q 60 108 38 95 Z" fill="#90C8C4"/>
    <path d="M 44 90 Q 42 60 53 42 Q 62 26 76 24 Q 94 21 108 30 Q 126 42 130 60 Q 134 76 125 88 Q 114 99 88 101 Q 62 103 44 90 Z" fill="#A8D8D4"/>
    <path d="M 55 85 Q 52 62 62 48 Q 70 36 82 34 Q 98 32 110 42 Q 122 53 122 68 Q 121 80 112 88 Q 100 96 80 96 Q 62 96 55 85 Z" fill="#C0E8E4" opacity="0.7"/>
    <ellipse cx="82" cy="45" rx="18" ry="10" fill="#80B8B4" opacity="0.5"/>
    <path d="M 55 70 Q 80 65 120 72" fill="none" stroke="#2A7070" stroke-width="1" stroke-dasharray="4,3" opacity="0.4"/>
    <path d="M 58 80 Q 85 76 118 82" fill="none" stroke="#2A7070" stroke-width="1" stroke-dasharray="4,3" opacity="0.3"/>
    <ellipse cx="75" cy="90" rx="12" ry="5" fill="#2A7070" opacity="0.15"/>
  </svg>
);

const landingUrlMap: Record<string, string> = {
  "ortopedychni-podushky":        "/ortopedychni-podushky",
  "masazhery":                    "/masazhery-dlya-spyny",
  "ortopedychni-masazhni-kylymky":"/masazhni-kylymky",
  "ortezy-i-bandazhi":            "/bandazhi-ta-ortezy",
  "ortopedychni-ustilky":         "/ortopedychni-ustilky-kuputy",
  "rozvyvaiuchi-ihrashky":        "/tovary-dlya-ditey-ortopedychni",
};

const categoryConfig: Record<string, {
  bg: string;
  accent: string;
  Illustration: () => JSX.Element;
}> = {
  "ortopedychni-podushky": {
    bg: "from-[#F5EFE6] to-[#EDE3D5]",
    accent: "#8A6440",
    Illustration: PillowIllustration,
  },
  "ortopedychni-masazhni-kylymky": {
    bg: "from-[#EAF2E8] to-[#D8EAD5]",
    accent: "#3D7A55",
    Illustration: MatIllustration,
  },
  "ortezy-i-bandazhi": {
    bg: "from-[#E8EDF5] to-[#D5DEEA]",
    accent: "#3D5A8A",
    Illustration: BandageIllustration,
  },
  "masazhery": {
    bg: "from-[#F0EAE8] to-[#E5D8D5]",
    accent: "#8A4040",
    Illustration: MassagerIllustration,
  },
  "tovary-dlia-krasy": {
    bg: "from-[#F0E8F0] to-[#E5D5E5]",
    accent: "#8A4070",
    Illustration: BeautyIllustration,
  },
  "rozvyvaiuchi-ihrashky": {
    bg: "from-[#F5F0E0] to-[#EAE5CC]",
    accent: "#7A6A20",
    Illustration: ToysIllustration,
  },
  "ortopedychni-ustilky": {
    bg: "from-[#E8F2F0] to-[#D5EAE8]",
    accent: "#2A7070",
    Illustration: InsoleIllustration,
  },
};

export const CategoryCard = ({ category }: { category: Category }) => {
  const cfg = categoryConfig[category.id] ?? {
    bg: "from-[#F5F0EA] to-[#EDE3D5]",
    accent: "#3D7A55",
    Illustration: PillowIllustration,
  };
  const { Illustration } = cfg;

  return (
    <Link
      to={landingUrlMap[category.id] ?? `/catalog?category=${category.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${cfg.bg} border border-white/70 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card active:scale-95`}
    >
      {/* Illustration */}
      <div className="flex items-center justify-center pt-3 pb-1 px-2 sm:pt-5 sm:pb-2">
        <div className="w-full transition-transform duration-300 group-hover:scale-105">
          <Illustration />
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col px-2 pb-3 sm:px-4 sm:pb-4">
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
