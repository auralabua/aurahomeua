import { Link } from "react-router-dom";
import { Category } from "@/data/products";

export const CategoryCard = ({ category }: { category: Category }) => {
  const Icon = category.icon;
  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className="group flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-secondary hover:bg-card shadow-soft hover:shadow-card border-2 border-transparent hover:border-primary transition-all duration-200 hover:-translate-y-2"
    >
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-card group-hover:bg-primary/10 text-primary transition-all duration-200">
        <Icon className="h-7 w-7" strokeWidth={1.25} />
      </div>
      <h3 className="font-light text-sm leading-tight text-foreground group-hover:text-primary transition-smooth">{category.name}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2 font-light">{category.description}</p>
    </Link>
  );
};
