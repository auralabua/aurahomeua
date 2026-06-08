import { Truck, CreditCard, RotateCcw, Package, Clock, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const PHONE = "+380956981124";
const TELEGRAM = "https://t.me/BodyHome1";
const VIBER = "viber://chat?number=%2B380956981124";

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border/60 bg-card p-7">
    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-light">{title}</h2>
    </div>
    {children}
  </div>
);

const Li = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2.5 text-sm font-light text-muted-foreground">
    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
    {children}
  </li>
);

const Delivery = () => {
  useSEO({
    title: "Доставка та оплата — BodyHome",
    description: "Доставка Новою Поштою, Meest та Укрпоштою по всій Україні. Оплата при отриманні або онлайн карткою (LiqPay). Повернення протягом 14 днів.",
    keywords: "доставка Нова Пошта, оплата при отриманні, LiqPay, доставка ортопедичних товарів",
    url: "/delivery",
  });

  return (
  <div className="container py-14 max-w-4xl">
    <p className="aura-kicker mb-4">доставка та оплата</p>
    <h1 className="text-4xl md:text-5xl font-light mb-3">Доставка та оплата</h1>
    <p className="text-muted-foreground font-light mb-10">Працюємо по всій Україні. Оплата після отримання або онлайн.</p>

    <div className="grid gap-5">
      {/* Доставка */}
      <Section icon={Truck} title="Доставка по Україні">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "Нова Пошта", desc: "Доставка у відділення або поштомат. Термін: 1–3 робочих дні по Україні.", days: "1–3 дні" },
            { name: "Meest Express", desc: "Доставка у відділення Meest по всій Україні.", days: "1–4 дні" },
            { name: "Укрпошта", desc: "Доставка у поштові відділення по всій Україні.", days: "2–5 днів" },
          ].map((d, i) => (
            <div key={i} className="rounded-xl bg-secondary/40 p-4">
              <p className="font-medium text-sm mb-1">{d.name}</p>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">{d.desc}</p>
              <p className="text-xs text-primary mt-2">⏱ {d.days}</p>
            </div>
          ))}
        </div>
        <ul className="mt-4 space-y-2">
          <Li>Вартість доставки оплачується за тарифами перевізника при отриманні</Li>
          <Li>Після оформлення замовлення менеджер зв'яжеться з вами для підтвердження</Li>
          <Li>Відправка в день замовлення при замовленні до 14:00 (пн–пт)</Li>
        </ul>
      </Section>

      {/* Оплата */}
      <Section icon={CreditCard} title="Способи оплати">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "Накладений платіж", desc: "Оплата готівкою або карткою при отриманні посилки у відділенні Нової Пошти або Meest. Найпопулярніший спосіб.", badge: "Найпопулярніше" },
            { title: "Оплата онлайн (LiqPay)", desc: "Оплата карткою Visa, Mastercard або Apple Pay через захищену платіжну систему LiqPay. Підтримуються всі українські банки.", badge: "Миттєво" },
          ].map((p, i) => (
            <div key={i} className="rounded-xl border border-border/60 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">{p.title}</p>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{p.badge}</span>
              </div>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <ul className="mt-4 space-y-2">
          <Li>Всі платежі захищені протоколом SSL</Li>
          <Li>Дані картки не зберігаються на нашому сайті</Li>
        </ul>
      </Section>

      {/* Повернення */}
      <Section icon={RotateCcw} title="Повернення та обмін">
        <ul className="space-y-2 mb-4">
          <Li>Повернення товару можливе протягом <strong>14 днів</strong> з дня отримання</Li>
          <Li>Товар має бути у первісному вигляді, з усіма етикетками та в оригінальній упаковці</Li>
          <Li>Товари особистої гігієни (устілки, бандажі що вже використовувались) поверненню не підлягають</Li>
          <Li>Вартість зворотньої доставки несе покупець, якщо товар повертається не через дефект</Li>
          <Li>При виявленні заводського браку — повернення або обмін за рахунок магазину</Li>
        </ul>
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm text-primary font-light">
          Для оформлення повернення зверніться до нас у Telegram, Viber або по телефону
        </div>
      </Section>

      {/* Як замовити */}
      <Section icon={Package} title="Як зробити замовлення">
        <div className="grid md:grid-cols-4 gap-3">
          {[
            { step: "1", text: "Оберіть товар і додайте в кошик" },
            { step: "2", text: "Заповніть форму замовлення" },
            { step: "3", text: "Отримайте підтвердження від менеджера" },
            { step: "4", text: "Отримайте замовлення та оплатіть" },
          ].map((s, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-secondary/40">
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary text-sm font-medium grid place-items-center mx-auto mb-2">{s.step}</div>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Контакти */}
      <div className="rounded-2xl border border-border/60 bg-card p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Phone className="h-5 w-5 text-primary" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-light">Залишились питання?</h2>
        </div>
        <p className="text-sm text-muted-foreground font-light mb-5">Напишіть нам — відповімо швидко і допоможемо з вибором</p>
        <div className="flex flex-wrap gap-3">
          <a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 rounded-full border border-border px-5 h-10 text-sm font-light hover:border-primary hover:text-primary transition-all">
            <Phone className="h-4 w-4" /> {PHONE}
          </a>
          <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#229ED9] text-white px-5 h-10 text-sm font-light hover:opacity-90 transition-all">
            <MessageCircle className="h-4 w-4" /> Telegram
          </a>
          <a href={VIBER} className="inline-flex items-center gap-2 rounded-full bg-[#7360F2] text-white px-5 h-10 text-sm font-light hover:opacity-90 transition-all">
            <MessageCircle className="h-4 w-4" /> Viber
          </a>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Delivery;
