import { Link } from "react-router-dom";
import { Instagram, Facebook, Music2, Phone } from "lucide-react";

const PHONE = "+380956981124";
const TELEGRAM = "https://t.me/aurahomeua";
const VIBER = "viber://chat?number=%2B380956981124";

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z"/>
  </svg>
);

const ViberIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M11.4 0C6.37.03 2.33 2.4.64 6.37c-.97 2.3-1.03 4.74-.97 7.18.06 2.44.13 4.88 1.36 7.07 1.23 2.2 3.34 3.8 5.7 4.5.3.09.62.12.94.07l-.01-4.97c-.3-.1-.58-.24-.84-.42a5.3 5.3 0 01-2.02-3.73c-.1-2.52.26-5.18 1.84-7.22C8.27 6.5 10.73 5.7 13.1 5.7c2.37 0 4.72.97 6.2 2.8 1.48 1.85 1.8 4.38 1.72 6.7-.08 2.3-.48 4.73-1.97 6.54-1.5 1.8-3.9 2.7-6.2 2.57-.6-.03-1.18-.15-1.74-.33l-.01 4.97c.55.12 1.1.14 1.65.1 3.28-.22 6.36-1.84 8.3-4.43 1.94-2.6 2.46-5.9 2.46-9.08 0-3.18-.52-6.48-2.46-9.08C18.98 1.9 15.26.22 11.4 0z"/>
  </svg>
);

export const Footer = () => {
  return (
    <footer className="mt-20 bg-secondary">
      <div className="container py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link to="/" className="inline-block mb-4">
            <span className="text-2xl font-light tracking-wide text-foreground">Aura Home</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-light">
            Якісні товари для комфорту, краси та домашнього догляду.
          </p>
          <div className="mt-5 space-y-2">
            <a href={`tel:${PHONE}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-light">
              <Phone className="h-4 w-4 text-primary" /> {PHONE}
            </a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#229ED9] transition-colors font-light">
              <TelegramIcon /> Telegram
            </a>
            <a href={VIBER} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#7360F2] transition-colors font-light">
              <ViberIcon /> Viber
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-light text-base mb-4 text-foreground">Магазин</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalog" className="text-muted-foreground hover:text-primary transition-smooth font-light">Каталог</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-smooth font-light">Про нас</Link></li>
            <li><Link to="/contacts" className="text-muted-foreground hover:text-primary transition-smooth font-light">Доставка</Link></li>
            <li><Link to="/contacts" className="text-muted-foreground hover:text-primary transition-smooth font-light">Повернення</Link></li>
            <li><Link to="/contacts" className="text-muted-foreground hover:text-primary transition-smooth font-light">Контакти</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-light text-base mb-4 text-foreground">Категорії</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalog?category=ortopedychni-podushky" className="text-muted-foreground hover:text-primary transition-smooth font-light">Ортопедичні подушки</Link></li>
            <li><Link to="/catalog?category=masazhery" className="text-muted-foreground hover:text-primary transition-smooth font-light">Масажери</Link></li>
            <li><Link to="/catalog?category=ortezy-i-bandazhi" className="text-muted-foreground hover:text-primary transition-smooth font-light">Ортези і бандажі</Link></li>
            <li><Link to="/catalog?category=tovary-dlia-krasy" className="text-muted-foreground hover:text-primary transition-smooth font-light">Товари для краси</Link></li>
            <li><Link to="/catalog?category=ortopedychni-ustilky" className="text-muted-foreground hover:text-primary transition-smooth font-light">Ортопедичні устілки</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-light text-base mb-4 text-foreground">Ми у соцмережах</h4>
          <div className="flex gap-3 mb-6">
            {[
              { Icon: Instagram, href: "#", label: "Instagram" },
              { Icon: Facebook, href: "#", label: "Facebook" },
              { Icon: Music2, href: "#", label: "TikTok" },
            ].map(({ Icon, href, label }) => (
              <a key={label} href={href} aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full bg-background hover:text-primary hover:bg-background/80 transition-smooth">
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ))}
          </div>
          <div className="space-y-2">
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-4 py-2 rounded-full bg-[#229ED9]/10 text-[#229ED9] text-sm font-light hover:bg-[#229ED9]/20 transition-colors">
              <TelegramIcon /> Написати в Telegram
            </a>
            <a href={VIBER}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-full bg-[#7360F2]/10 text-[#7360F2] text-sm font-light hover:bg-[#7360F2]/20 transition-colors">
              <ViberIcon /> Написати у Viber
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60 py-5">
        <div className="container text-center text-xs text-muted-foreground font-light">
          © 2025 Aura Home. Всі права захищені.
        </div>
      </div>
    </footer>
  );
};
