import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Contacts = () => {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Дякуємо!", description: "Ми зв'яжемось з вами найближчим часом." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div>
      <section className="gradient-hero py-14">
        <div className="container text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl mb-3">Контакти</h1>
          <p className="text-muted-foreground">Маєте питання? Ми завжди готові допомогти!</p>
        </div>
      </section>

      <section className="container py-14 grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          {[
            { icon: Phone, title: "Телефон", value: "+380 (67) 123-45-67", href: "tel:+380671234567" },
            { icon: Mail, title: "Email", value: "info@olvi.ua", href: "mailto:info@olvi.ua" },
            { icon: MessageCircle, title: "Viber", value: "+380 67 123 4567", href: "viber://chat?number=+380671234567" },
            { icon: Send, title: "Telegram", value: "@olvi_ua", href: "https://t.me/olvi_ua" },
            { icon: MapPin, title: "Адреса", value: "м. Київ, вул. Здорова, 12" },
            { icon: Clock, title: "Графік роботи", value: "Пн–Сб, 9:00 – 19:00" },
          ].map((c, i) => (
            <a
              key={i}
              href={c.href}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-soft hover:shadow-card transition-smooth"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{c.title}</div>
                <div className="font-medium">{c.value}</div>
              </div>
            </a>
          ))}
        </div>

        <form onSubmit={onSubmit} className="p-8 rounded-3xl bg-card border border-border/60 shadow-card space-y-4 h-fit">
          <h2 className="text-2xl mb-2">Напишіть нам</h2>
          <div className="grid gap-2">
            <Label htmlFor="name">Ім'я</Label>
            <Input id="name" required placeholder="Ваше ім'я" className="rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input id="phone" required type="tel" placeholder="+380" className="rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Повідомлення</Label>
            <Textarea id="message" required rows={4} placeholder="Розкажіть, чим ми можемо допомогти..." className="rounded-xl resize-none" />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-full gradient-primary border-0 shadow-glow hover:opacity-95">
            Надіслати повідомлення
          </Button>
        </form>
      </section>
    </div>
  );
};

export default Contacts;
