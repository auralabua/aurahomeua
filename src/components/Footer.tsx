import { Link } from "react-router-dom";
import { Instagram, Facebook, Music2, Phone, Mail, MapPin, Sparkles, ShieldCheck, CreditCard, Truck, HeartHandshake } from "lucide-react";

const PHONE = "+380956981124";
const TELEGRAM = "https://t.me/aurahomeua";
const VIBER = "viber://chat?number=%2B380956981124";

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z" />
  </svg>
);

const ViberIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M11.4 0C6.37.03 2.33 2.4.64 6.37c-.97 2.3-1.03 4.74-.97 7.18.06 2.44.13 4.88 1.36 7.07 1.23 2.2 3.34 3.8 5.7 4.5.3.09.62.12.94.07l-.01-4.97c-.3-.1-.58-.24-.84-.42a5.3 5.3 0 01-2.02-3.73c-.1-2.52.26-5.18 1.84-7.22C8.27 6.5 10.73 5.7 13.1 5.7c2.37 0 4.72.97 6.2 2.8 1.48 1.85 1.8 4.38 1.72 6.7-.08 2.3-.48 4.73-1.97 6.54-1.5 1.8-3.9 2.7-6.2 2.57-.6-.03-1.18-.15-1.74-.33l-.01 4.97c.55.12 1.1.14 1.65.1 3.28-.22 6.36-1.84 8.3-4.43 1.94-2.6 2.46-5.9 2.46-9.08 0-3.18-.52-6.48-2.46-9.08C18.98 1.9 15.26.22 11.4 0z" />
  </svg>
);

const advantages = [
  {
    icon: ShieldCheck,
    title: "Підбір під задачу",
    desc: "Допоможемо обрати ортопедичний виріб — бандаж, подушку чи масажер — точно під ваш запит і діагноз.",
  },
  {
    icon: CreditCard,
    title: "Оплата при отриманні",
    desc: "Платите накладним платежем лише після того, як отримали й перевірили замовлення на пошті.",
  },
  {
    icon: Truck,
    title: "Доставка Новою Поштою",
    desc: "Відправляємо по всій Україні наступного дня. Термін доставки — 1–3 робочі дні.",
  },
  {
    icon: HeartHandshake,
    title: "Підтримка після покупки",
    desc: "Консультуємо з правильного використання та вирішуємо будь-яке питання після отримання товару.",
  },
];

export const Footer = () => (
  <footer className="mt-20 border-t border-border bg-black/20">
    <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_.8fr_1.15fr_1fr]">

      {/* Brand */}
      <div>
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary ring-1 ring-primary/25 text-lg font-semibold">B</span>
          <div>
            <div className="text-xl font-light uppercase tracking-[0.18em]">BodyHome</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">ортопедія та здоров'я вдома</div>
          </div>
        </div>
        <p className="max-w-sm text-sm font-light leading-relaxed text-muted-foreground">
          Інтернет-магазин ортопедичних товарів: подушки, бандажі, масажери, устілки та прилади для відновлення.
          Купуйте якісні товари для здоров'я з доставкою по всій Україні.
        </p>
        <div className="mt-5 grid gap-2 text-sm text-muted-foreground">
          <a href={`tel:${PHONE}`} className="flex items-center gap-2 hover:text-primary">
            <Phone className="h-4 w-4 text-primary" />{PHONE}
          </a>
          <a href="mailto:bodyhome@gmail.com" className="flex items-center gap-2 hover:text-primary">
            <Mail className="h-4 w-4 text-primary" />bodyhome@gmail.com
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />Доставка по всій Україні
          </span>
        </div>
      </div>

      {/* Shop links */}
      <div>
        <h4 className="mb-4 text-sm uppercase tracking-[0.24em] text-foreground/80">Магазин</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/catalog" className="hover:text-primary">Каталог товарів</Link></li>
          <li><Link to="/about" className="hover:text-primary">Про нас</Link></li>
          <li><Link to="/delivery" className="hover:text-primary">Доставка і оплата</Link></li>
          <li><Link to="/delivery" className="hover:text-primary">Повернення товару</Link></li>
          <li><Link to="/privacy" className="hover:text-primary">Конфіденційність</Link></li>
          <li><Link to="/public-offer" className="hover:text-primary">Публічна оферта</Link></li>
        </ul>
      </div>

      {/* Advantages */}
      <div>
        <h4 className="mb-5 text-sm uppercase tracking-[0.24em] text-foreground/80">Переваги</h4>
        <ul className="space-y-4">
          {advantages.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-3">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground/85">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-foreground/80">
          <Sparkles className="h-4 w-4 text-primary" />Зв'язок
        </h4>
        <div className="mb-6 flex gap-3">
          {[Instagram, Facebook, Music2].map((Icon, i) => (
            <a key={i} href="#" aria-label="Соціальні мережі BodyHome"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.055] text-muted-foreground hover:bg-primary/15 hover:text-primary">
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
        <div className="grid gap-2">
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
            <TelegramIcon />Telegram
          </a>
          <a href={VIBER}
            className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
            <ViberIcon />Viber
          </a>
        </div>
      </div>
    </div>

    <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
      © 2026 BodyHome — ортопедичні товари, масажери та бандажі з доставкою по Україні
    </div>
  </footer>
);
