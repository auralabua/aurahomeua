import { Link } from "react-router-dom";
import { Category } from "@/data/products";

export const CategoryCard = ({ category }: { category: Category }) => {
  const Icon = category.icon;
  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-smooth"
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary group-hover:gradient-primary group-hover:text-primary-foreground transition-smooth">
        <Icon className="h-8 w-8" strokeWidth={1.5} />
      </div>
      <h3 className="font-semibold text-sm leading-tight">{category.name}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
    </Link>
  );
};
