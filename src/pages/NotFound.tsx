import { Link, useLocation } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  useSEO({ title: "Сторінку не знайдено", url: location.pathname, noindex: true });

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center px-4">
        <p className="text-8xl font-light text-primary/30 mb-4">404</p>
        <h1 className="text-2xl font-medium mb-2">Сторінку не знайдено</h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto text-sm">
          Можливо, посилання застаріло або товар вже недоступний. Спробуйте перейти до каталогу.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="rounded-full btn-aura border-0">
            <Link to="/catalog"><ShoppingBag className="h-4 w-4 mr-2" />Перейти до каталогу</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/"><Home className="h-4 w-4 mr-2" />На головну</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
