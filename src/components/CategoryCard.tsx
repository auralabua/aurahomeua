import { Link } from "react-router-dom";
import { Category } from "@/data/products";

export const CategoryCard = ({ category }: { category: Category }) => {
  const Icon = category.icon;
  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-card shadow-soft hover:shadow-card transition-smooth"
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary text-primary transition-smooth">
        <Icon className="h-7 w-7" strokeWidth={1.25} />
      </div>
      <h3 className="font-light text-sm leading-tight text-foreground">{category.name}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2 font-light">{category.description}</p>
    </Link>
  );
};
