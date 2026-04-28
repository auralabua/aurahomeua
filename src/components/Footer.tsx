import { Link } from "react-router-dom";
import { Instagram, Facebook, Music2 } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-20 bg-secondary">
      <div className="container py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <Link to="/" className="inline-block mb-4">
            <span className="text-2xl font-light tracking-wide text-foreground">Aura Home</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Якісні товари для комфорту, краси та домашнього догляду.
          </p>
        </div>

        <div>
          <h4 className="font-light text-base mb-4 text-foreground">Магазин</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalog" className="text-muted-foreground hover:text-primary transition-smooth">Каталог</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-smooth">Про нас</Link></li>
            <li><Link to="/contacts" className="text-muted-foreground hover:text-primary transition-smooth">Доставка</Link></li>
            <li><Link to="/contacts" className="text-muted-foreground hover:text-primary transition-smooth">Повернення</Link></li>
            <li><Link to="/contacts" className="text-muted-foreground hover:text-primary transition-smooth">Контакти</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-light text-base mb-4 text-foreground">Ми у соцмережах</h4>
          <div className="flex gap-3">
            {[Instagram, Facebook, Music2].map((Icon, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full bg-background hover:text-primary transition-smooth" aria-label="Соцмережа">
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 py-5">
        <div className="container text-center text-xs text-muted-foreground">
          © 2025 Aura Home. Всі права захищені.
        </div>
      </div>
    </footer>
  );
};
