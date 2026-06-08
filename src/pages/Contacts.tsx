import { Phone, Mail, MapPin, MessageCircle, Truck, RotateCcw, CreditCard } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
const PHONE = "+380956981124";
const TELEGRAM = "https://t.me/BodyHome1";
const VIBER = "viber://chat?number=%2B380956981124";
const Contacts = () => {
  useSEO({
    title: "Контакти та доставка — BodyHome",
    description: "Контакти BodyHome: телефон, Telegram, Viber. Доставка Новою Поштою по всій Україні. Оплата при отриманні.",
    url: "/contacts",
  });
  return (
    <div className="container py-14">
      <div className="mb-12 max-w-3xl">
        <p className="aura-kicker mb-4">контакти та доставка</p>
        <h1 className="text-5xl md:text-7xl leading-[.95]">Звʼязок, доставка і <span className="text-primary">підтримка</span></h1>
        <p className="mt-6 text-lg font-light text-muted-foreground">Напишіть нам — допоможемо підібрати товар, уточнити наявність і оформити доставку.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-2xl border border-border/40 bg-white p-8">
          <h2 className="mb-6 text-3xl font-light">Контакти</h2>
          <div className="grid gap-4 text-sm">
            <a href={`tel:${PHONE}`} className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-4 hover:text-primary transition-colors">
              <Phone className="h-5 w-5 text-primary"/>{PHONE}
            </a>
            <a href="mailto:bodyhome@gmail.com" className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-4 hover:text-primary transition-colors">
              <Mail className="h-5 w-5 text-primary"/>bodyhome@gmail.com
            </a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-primary/10 p-4 text-primary hover:bg-primary/20 transition-colors">
              <MessageCircle className="h-5 w-5"/>Telegram
            </a>
            <a href={VIBER} className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-4 hover:text-primary transition-colors">
              <MessageCircle className="h-5 w-5 text-primary"/>Viber
            </a>
            <div className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-4 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary"/>Україна, доставка по всіх містах
            </div>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {i: Truck, t: "Доставка", d: "Нова Пошта / Meest у відділення або курʼєром по всій Україні."},
            {i: CreditCard, t: "Оплата", d: "Карткою онлайн або після оплата при отриманні."},
            {i: RotateCcw, t: "Повернення", d: "14 днів на повернення товару належної якості."},
          ].map((x, k) => (
            <div key={k} className="rounded-2xl border border-border/40 bg-white p-6">
              <x.i className="mb-5 h-7 w-7 text-primary"/>
              <h3 className="text-2xl font-light">{x.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Contacts;
