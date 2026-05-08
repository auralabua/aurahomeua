import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Category } from "@/data/products";
import pillows from "@/assets/cat-pillows.jpg";
import mats from "@/assets/cat-mats.jpg";
import braces from "@/assets/cat-braces.jpg";
import massagers from "@/assets/cat-massagers.jpg";
import beauty from "@/assets/cat-beauty.jpg";
import toys from "@/assets/cat-toys.jpg";
import insoles from "@/assets/cat-insoles.jpg";

const imageMap: Record<string, string> = {
  pillows, mats, braces, massagers, beauty, toys, insoles,
  "ortopedychni-podushky": pillows,
  "ortopedychni-masazhni-kylymky": mats,
  "ortezy-i-bandazhi": braces,
  masazhery: massagers,
  "tovary-dlia-krasy": beauty,
  "rozvyvaiuchi-ihrashky": toys,
  "ortopedychni-ustilky": insoles,
};

const nameMap: Array<[string, string]> = [
  ["подуш", pillows],
  ["килим", mats],
  ["ортез", braces],
  ["бандаж", braces],
  ["масаж", massagers],
  ["крас", beauty],
  ["іграш", toys],
  ["устіл", insoles],
];

const getImage = (c: Category) =>
  imageMap[c.id] ??
  nameMap.find(([n]) => c.name.toLowerCase().includes(n))?.[1] ??
  pillows;

export const CategoryCard = ({ category }: { category: Category }) => {
  const img = getImage(category);
  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className="group relative block overflow-hidden rounded-3xl border border-border bg-secondary shadow-soft transition-all duration-500 hover:shadow-elevated hover:-translate-y-1"
      style={{ aspectRatio: "3/4" }}
    >
      <img
        src={img}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div className="text-white">
          <h3 className="text-lg font-light leading-tight">{category.name}</h3>
          {category.description && (
            <p className="mt-1 text-xs font-light text-white/75 line-clamp-1">
              {category.description}
            </p>
          )}
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/95 text-foreground transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
};
