import { Link } from "react-router-dom";
import { Heart, Phone, Mail, Instagram, Facebook, Music2, MessageCircle, Send } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="container py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary">
              <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-primary">OLVI</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            OLVI — якісні ортопедичні та медичні товари для всієї родини.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Магазин</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalog" className="text-muted-foreground hover:text-primary transition-smooth">Каталог</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-smooth">Про нас</Link></li>
            <li><Link to="/contacts" className="text-muted-foreground hover:text-primary transition-smooth">Доставка і оплата</Link></li>
            <li><Link to="/contacts" className="text-muted-foreground hover:text-primary transition-smooth">Повернення товару</Link></li>
            <li><Link to="/contacts" className="text-muted-foreground hover:text-primary transition-smooth">Контакти</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Контакти</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +380 (67) 123-45-67</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> info@olvi.ua</li>
            <li className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary" /> Viber: +380 67 123 4567</li>
            <li className="flex items-center gap-2"><Send className="h-4 w-4 text-primary" /> Telegram: @olvi_ua</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Ми у соцмережах</h4>
          <div className="flex gap-3">
            {[Instagram, Facebook, Music2].map((Icon, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full bg-background shadow-soft hover:shadow-card hover:text-primary transition-smooth" aria-label="Соцмережа">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Працюємо: Пн–Сб, 9:00–19:00</p>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <div className="container text-center text-xs text-muted-foreground">
          © 2025 OLVI. Всі права захищені.
        </div>
      </div>
    </footer>
  );
};
