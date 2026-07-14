import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Category } from "@/data/products";

/* ─── Realistic premium illustrations ──────────────────────────────────── */

const PillowIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="pg1" x1="100" y1="28" x2="100" y2="145" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F5E0C0"/>
        <stop offset="1" stopColor="#C8944A"/>
      </linearGradient>
      <linearGradient id="pg2" x1="100" y1="42" x2="100" y2="130" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF5E6"/>
        <stop offset="1" stopColor="#E0B870"/>
      </linearGradient>
      <radialGradient id="pg3" cx="50%" cy="40%" r="50%">
        <stop stopColor="white" stopOpacity="0.35"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="150" rx="62" ry="6" fill="#8A6440" opacity="0.1"/>
    {/* main body */}
    <path d="M18 88 Q18 44 56 34 Q76 27 100 29 Q124 27 144 34 Q182 44 182 88 Q182 124 144 136 Q124 143 100 143 Q76 143 56 136 Q18 124 18 88Z" fill="url(#pg1)"/>
    {/* inner recess */}
    <path d="M33 88 Q33 56 64 47 Q80 42 100 43 Q120 42 136 47 Q167 56 167 88 Q167 114 136 123 Q120 128 100 128 Q80 128 64 123 Q33 114 33 88Z" fill="url(#pg2)"/>
    {/* cervical depression */}
    <ellipse cx="100" cy="86" rx="30" ry="17" fill="#C08840" opacity="0.18"/>
    {/* left support lobe */}
    <path d="M18 74 Q13 52 30 44 Q34 52 35 68Z" fill="#D4A055" opacity="0.65"/>
    {/* right support lobe */}
    <path d="M182 74 Q187 52 170 44 Q166 52 165 68Z" fill="#D4A055" opacity="0.65"/>
    {/* stitching */}
    <path d="M35 88 Q100 76 165 88" stroke="#A87030" strokeWidth="1.1" strokeDasharray="5,4" opacity="0.45"/>
    <path d="M54 118 Q100 110 146 118" stroke="#A87030" strokeWidth="0.9" strokeDasharray="4,3" opacity="0.3"/>
    {/* highlight */}
    <ellipse cx="100" cy="62" rx="38" ry="14" fill="url(#pg3)"/>
  </svg>
);

const MatIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="mg1" x1="100" y1="14" x2="100" y2="138" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6DB87A"/>
        <stop offset="1" stopColor="#2E6B3E"/>
      </linearGradient>
      <linearGradient id="mg2" x1="100" y1="22" x2="100" y2="130" gradientUnits="userSpaceOnUse">
        <stop stopColor="#90D4A0"/>
        <stop offset="1" stopColor="#4A9660"/>
      </linearGradient>
      <radialGradient id="spike" cx="50%" cy="30%" r="60%">
        <stop stopColor="#7ED898"/>
        <stop offset="1" stopColor="#1E5030"/>
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="148" rx="58" ry="6" fill="#2A6040" opacity="0.12"/>
    {/* mat base */}
    <rect x="22" y="14" width="156" height="124" rx="12" fill="url(#mg1)"/>
    <rect x="30" y="22" width="140" height="108" rx="9" fill="url(#mg2)"/>
    {/* spike grid 6×4 */}
    {[46,68,90,112,134,156].map(x =>
      [38,62,86,110].map(y => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y+4} rx="5.5" ry="2" fill="#1A4828" opacity="0.3"/>
          <path d={`M${x-5} ${y+4} Q${x} ${y-10} ${x+5} ${y+4} Q${x} ${y+2} ${x-5} ${y+4}Z`} fill="url(#spike)"/>
          <circle cx={x} cy={y-10} r="1.5" fill="#A0ECBA" opacity="0.8"/>
        </g>
      ))
    )}
    {/* border */}
    <rect x="22" y="14" width="156" height="124" rx="12" stroke="#1E5030" strokeWidth="1.5" opacity="0.3"/>
    {/* top highlight */}
    <rect x="30" y="22" width="140" height="20" rx="9" fill="white" opacity="0.08"/>
  </svg>
);

const BandageIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="br1" x1="60" y1="0" x2="140" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C8D8EE"/>
        <stop offset="0.5" stopColor="#E8F0FA"/>
        <stop offset="1" stopColor="#B0C4E0"/>
      </linearGradient>
      <linearGradient id="br2" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#4A6EA0"/>
        <stop offset="1" stopColor="#2A4A78"/>
      </linearGradient>
      <linearGradient id="br3" x1="0" y1="0" x2="1" y2="0">
        <stop stopColor="#5A80B8"/>
        <stop offset="1" stopColor="#3A5888"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="152" rx="44" ry="5" fill="#2A4070" opacity="0.1"/>
    {/* main brace cylinder */}
    <rect x="66" y="10" width="68" height="130" rx="34" fill="url(#br1)"/>
    {/* inner highlight */}
    <rect x="74" y="18" width="34" height="60" rx="17" fill="white" opacity="0.5"/>
    {/* strap 1 */}
    <rect x="56" y="28" width="88" height="18" rx="9" fill="url(#br2)" opacity="0.82"/>
    <rect x="56" y="28" width="88" height="7" rx="4" fill="url(#br3)" opacity="0.5"/>
    <rect x="108" y="30" width="32" height="12" rx="6" fill="#1E3460" opacity="0.4"/>
    {/* strap 2 */}
    <rect x="56" y="58" width="88" height="18" rx="9" fill="url(#br2)" opacity="0.74"/>
    <rect x="56" y="58" width="88" height="7" rx="4" fill="url(#br3)" opacity="0.45"/>
    <rect x="108" y="60" width="32" height="12" rx="6" fill="#1E3460" opacity="0.35"/>
    {/* strap 3 */}
    <rect x="56" y="88" width="88" height="18" rx="9" fill="url(#br2)" opacity="0.66"/>
    <rect x="56" y="88" width="88" height="7" rx="4" fill="url(#br3)" opacity="0.4"/>
    <rect x="108" y="90" width="32" height="12" rx="6" fill="#1E3460" opacity="0.3"/>
    {/* strap 4 */}
    <rect x="56" y="118" width="88" height="16" rx="8" fill="url(#br2)" opacity="0.58"/>
    <rect x="108" y="120" width="32" height="10" rx="5" fill="#1E3460" opacity="0.25"/>
    {/* outline */}
    <rect x="66" y="10" width="68" height="130" rx="34" stroke="#3A5888" strokeWidth="1" opacity="0.2"/>
  </svg>
);

const MassagerIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="mh1" x1="72" y1="0" x2="128" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C0A090"/>
        <stop offset="0.5" stopColor="#E8D0C0"/>
        <stop offset="1" stopColor="#A88878"/>
      </linearGradient>
      <linearGradient id="mh2" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#E8C8B8"/>
        <stop offset="1" stopColor="#B89080"/>
      </linearGradient>
      <radialGradient id="mh3" cx="40%" cy="35%" r="55%">
        <stop stopColor="#F0E0D8"/>
        <stop offset="1" stopColor="#C0948A"/>
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="152" rx="40" ry="5" fill="#804040" opacity="0.1"/>
    {/* handle */}
    <rect x="76" y="88" width="48" height="60" rx="14" fill="url(#mh1)"/>
    {/* grip texture */}
    {[102,112,122].map(y => (
      <g key={y}>
        <rect x="80" y={y} width="40" height="4" rx="2" fill="#907060" opacity="0.3"/>
      </g>
    ))}
    {/* handle highlight */}
    <rect x="80" y="92" width="16" height="40" rx="8" fill="white" opacity="0.18"/>
    {/* neck */}
    <rect x="82" y="62" width="36" height="30" rx="10" fill="url(#mh2)"/>
    <rect x="86" y="64" width="14" height="20" rx="7" fill="white" opacity="0.2"/>
    {/* head - percussion ball */}
    <circle cx="100" cy="38" r="32" fill="url(#mh3)"/>
    {/* head inner rings */}
    <circle cx="100" cy="38" r="24" fill="#D8A898" opacity="0.6"/>
    <circle cx="100" cy="38" r="14" fill="#C09080"/>
    <circle cx="100" cy="38" r="6" fill="#A87870"/>
    {/* head sheen */}
    <ellipse cx="90" cy="26" rx="10" ry="6" fill="white" opacity="0.3"/>
    {/* power button */}
    <circle cx="100" cy="76" r="6" fill="#6A3030" opacity="0.7"/>
    <circle cx="100" cy="76" r="3.5" fill="#C05050" opacity="0.9"/>
    {/* handle outline */}
    <rect x="76" y="88" width="48" height="60" rx="14" stroke="#907060" strokeWidth="0.8" opacity="0.3"/>
  </svg>
);

const BeautyIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="bv1" x1="88" y1="0" x2="112" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D4A8C8"/>
        <stop offset="0.5" stopColor="#EED0E8"/>
        <stop offset="1" stopColor="#C090B8"/>
      </linearGradient>
      <linearGradient id="bv2" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#E0B8D8"/>
        <stop offset="1" stopColor="#B888B0"/>
      </linearGradient>
      <radialGradient id="bv3" cx="40%" cy="35%" r="55%">
        <stop stopColor="#F0D8EC"/>
        <stop offset="1" stopColor="#C090B8"/>
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="152" rx="38" ry="5" fill="#904080" opacity="0.1"/>
    {/* handle */}
    <rect x="88" y="70" width="24" height="76" rx="12" fill="url(#bv1)"/>
    <rect x="92" y="76" width="10" height="42" rx="5" fill="white" opacity="0.28"/>
    {/* connector top */}
    <rect x="90" y="54" width="20" height="20" rx="6" fill="url(#bv2)"/>
    {/* top roller cylinder */}
    <ellipse cx="100" cy="38" rx="28" ry="16" fill="url(#bv3)"/>
    <ellipse cx="100" cy="38" rx="21" ry="11" fill="#DBAECE"/>
    <ellipse cx="100" cy="38" rx="8" ry="5" fill="#C090B8" opacity="0.7"/>
    {/* top roller axle */}
    <ellipse cx="72" cy="38" rx="5" ry="8" fill="#B880B0"/>
    <ellipse cx="128" cy="38" rx="5" ry="8" fill="#B880B0"/>
    {/* top roller sheen */}
    <ellipse cx="88" cy="30" rx="10" ry="5" fill="white" opacity="0.35"/>
    {/* bottom roller - smaller */}
    <ellipse cx="100" cy="62" rx="20" ry="11" fill="url(#bv3)"/>
    <ellipse cx="100" cy="62" rx="14" ry="7" fill="#DBAECE"/>
    <ellipse cx="100" cy="62" rx="5" ry="3.5" fill="#C090B8" opacity="0.7"/>
    <ellipse cx="80" cy="62" rx="4" ry="7" fill="#B880B0"/>
    <ellipse cx="120" cy="62" rx="4" ry="7" fill="#B880B0"/>
    <ellipse cx="91" cy="56" rx="7" ry="3.5" fill="white" opacity="0.3"/>
    {/* gem accents */}
    <circle cx="72" cy="38" r="3" fill="#D4A0CC" opacity="0.8"/>
    <circle cx="128" cy="38" r="3" fill="#D4A0CC" opacity="0.8"/>
    {/* handle bottom curve */}
    <rect x="88" y="70" width="24" height="76" rx="12" stroke="#C090B8" strokeWidth="0.8" opacity="0.25"/>
  </svg>
);

const ToysIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="ty1" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#F5D840"/>
        <stop offset="1" stopColor="#C8A010"/>
      </linearGradient>
      <linearGradient id="ty2" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#F09858"/>
        <stop offset="1" stopColor="#C06018"/>
      </linearGradient>
      <linearGradient id="ty3" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#58CC88"/>
        <stop offset="1" stopColor="#208848"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="152" rx="66" ry="6" fill="#604010" opacity="0.1"/>
    {/* Left cube - yellow */}
    <rect x="18" y="78" width="64" height="64" rx="8" fill="url(#ty1)"/>
    {/* left cube top face */}
    <path d="M18 78 L50 60 L82 78Z" fill="#F8E860" opacity="0.9"/>
    {/* left cube right face */}
    <path d="M82 78 L82 142 L50 142 L82 78Z" fill="#B89010" opacity="0.5"/>
    {/* left cube letter A */}
    <text x="42" y="118" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="32" fill="#A07808" opacity="0.7" textAnchor="middle">A</text>
    {/* Right cube - orange */}
    <rect x="118" y="84" width="62" height="62" rx="8" fill="url(#ty2)"/>
    {/* right cube top face */}
    <path d="M118 84 L149 66 L180 84Z" fill="#F8B070" opacity="0.9"/>
    {/* right cube right face */}
    <path d="M180 84 L180 146 L149 146 L180 84Z" fill="#A84808" opacity="0.45"/>
    {/* right cube letter B */}
    <text x="149" y="124" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="30" fill="#883808" opacity="0.7" textAnchor="middle">B</text>
    {/* Top arch block - green */}
    <rect x="38" y="36" width="60" height="52" rx="30" fill="url(#ty3)"/>
    {/* arch top face */}
    <path d="M38 56 L68 38 L98 56 L98 42 Q68 20 38 42Z" fill="#80E8A8" opacity="0.7"/>
    {/* arch letter C */}
    <text x="68" y="78" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="22" fill="#186038" opacity="0.75" textAnchor="middle">C</text>
    {/* highlights */}
    <rect x="22" y="80" width="28" height="14" rx="4" fill="white" opacity="0.15"/>
    <rect x="122" y="86" width="26" height="13" rx="4" fill="white" opacity="0.15"/>
  </svg>
);

const InsoleIllustration = () => (
  <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="in1" x1="88" y1="18" x2="88" y2="145" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7DC8C4"/>
        <stop offset="1" stopColor="#2A7878"/>
      </linearGradient>
      <linearGradient id="in2" x1="88" y1="24" x2="88" y2="138" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A8E0DC"/>
        <stop offset="1" stopColor="#4A9A96"/>
      </linearGradient>
      <radialGradient id="in3" cx="45%" cy="30%" r="45%">
        <stop stopColor="white" stopOpacity="0.35"/>
        <stop offset="1" stopColor="white" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="88" cy="150" rx="66" ry="6" fill="#1A6060" opacity="0.12"/>
    {/* insole outer shape - realistic foot profile */}
    <path d="M34 108 Q30 72 42 46 Q52 24 70 20 Q92 16 112 26 Q134 40 138 62 Q144 82 134 98 Q120 116 90 118 Q60 120 34 108Z" fill="url(#in1)"/>
    {/* insole inner shape */}
    <path d="M42 104 Q38 70 50 48 Q58 28 72 25 Q92 21 110 30 Q130 44 134 64 Q138 82 129 96 Q116 111 88 113 Q62 115 42 104Z" fill="url(#in2)"/>
    {/* toe area bump */}
    <ellipse cx="104" cy="32" rx="16" ry="10" fill="#7CBCB8" opacity="0.5"/>
    {/* arch support zone */}
    <path d="M48 90 Q52 68 64 58 Q76 48 90 46 Q108 46 118 56 Q128 66 126 80 Q124 92 110 100 Q94 108 76 106 Q56 102 48 90Z" fill="#C8ECEC" opacity="0.5"/>
    {/* arch support curve highlight */}
    <path d="M50 82 Q80 68 128 76" stroke="white" strokeWidth="2" strokeDasharray="5,4" opacity="0.5"/>
    <path d="M52 94 Q82 82 126 90" stroke="white" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.35"/>
    {/* heel circle */}
    <ellipse cx="64" cy="100" rx="18" ry="14" fill="#3A9090" opacity="0.3"/>
    {/* top highlight */}
    <path d="M34 108 Q30 72 42 46 Q52 24 70 20 Q92 16 112 26" fill="url(#in3)"/>
    {/* size markings */}
    <line x1="148" y1="36" x2="148" y2="112" stroke="#2A7878" strokeWidth="1" opacity="0.25"/>
    <line x1="144" y1="36" x2="152" y2="36" stroke="#2A7878" strokeWidth="1" opacity="0.25"/>
    <line x1="144" y1="112" x2="152" y2="112" stroke="#2A7878" strokeWidth="1" opacity="0.25"/>
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
    bg: "from-[#F7F0E4] to-[#EDE3CE]",
    accent: "#8A6440",
    Illustration: PillowIllustration,
  },
  "ortopedychni-masazhni-kylymky": {
    bg: "from-[#E8F4E8] to-[#D2EAD4]",
    accent: "#2E6B3E",
    Illustration: MatIllustration,
  },
  "ortezy-i-bandazhi": {
    bg: "from-[#E6EEF8] to-[#CCDAEE]",
    accent: "#2A4A78",
    Illustration: BandageIllustration,
  },
  "masazhery": {
    bg: "from-[#F5EAE6] to-[#EAD6CE]",
    accent: "#804040",
    Illustration: MassagerIllustration,
  },
  "tovary-dlia-krasy": {
    bg: "from-[#F5E6F4] to-[#EAD0EA]",
    accent: "#904080",
    Illustration: BeautyIllustration,
  },
  "rozvyvaiuchi-ihrashky": {
    bg: "from-[#F8F2DC] to-[#EEEACE]",
    accent: "#7A6010",
    Illustration: ToysIllustration,
  },
  "ortopedychni-ustilky": {
    bg: "from-[#E6F4F4] to-[#CCEAEA]",
    accent: "#2A7878",
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
