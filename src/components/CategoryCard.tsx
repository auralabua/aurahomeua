import { Link } from "react-router-dom";
import { Category } from "@/data/products";

const categoryPhotos: Record<string, string> = {
  "ortopedychni-podushky": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80&auto=format&fit=crop",
  "ortopedychni-masazhni-kylymky": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80&auto=format&fit=crop",
  "ortezy-i-bandazhi": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80&auto=format&fit=crop",
  "masazhery": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&q=80&auto=format&fit=crop",
  "tovary-dlia-krasy": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&auto=format&fit=crop",
  "rozvyvaiuchi-ihrashky": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80&auto=format&fit=crop",
  "ortopedychni-ustilky": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop",
};

const categoryColors: Record<string, string> = {
  "ortopedychni-podushky": "#C9A882",
  "ortopedychni-masazhni-kylymky": "#8FAF8C",
  "ortezy-i-bandazhi": "#8C9EAF",
  "masazhery": "#AF8C8C",
  "tovary-dlia-krasy": "#C4A0B0",
  "rozvyvaiuchi-ihrashky": "#B5A87A",
  "ortopedychni-ustilky": "#8CAFAF",
};

export const CategoryCard = ({ category }: { category: Category }) => {
  const photo = categoryPhotos[category.id];
  const color = categoryColors[category.id] || "#C9956A";

  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
      style={{ aspectRatio: "3/4" }}
    >
      {photo ? (
        <img
          src={photo}
          alt={category.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.style.backgroundColor = color;
            }
          }}
        />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: color }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-light text-sm leading-tight text-white drop-shadow">{category.name}</h3>
        {category.description && (
          <p className="text-xs text-white/70 mt-1 line-clamp-1 font-light">{category.description}</p>
        )}
      </div>
    </Link>
  );
};
