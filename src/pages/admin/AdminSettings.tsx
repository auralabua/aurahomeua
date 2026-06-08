import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Save, RefreshCw } from "lucide-react";

const STORAGE_KEY = "bodyhome_admin_settings";

interface Settings {
  siteName: string;
  phone: string;
  email: string;
  telegram: string;
  npApiKey: string;
  telegramBotToken: string;
  liqpayPublicKey: string;
  liqpayPrivateKey: string;
}

const defaults: Settings = {
  siteName: "BodyHome",
  phone: "+380956981124",
  email: "bodyhome@gmail.com",
  telegram: "@bodyhomeua",
  npApiKey: "",
  telegramBotToken: "",
  liqpayPublicKey: "",
  liqpayPrivateKey: "",
};

const loadSettings = (): Settings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
  } catch {
    return { ...defaults };
  }
};

const SectionHeader = ({ title, desc }: { title: string; desc: string }) => (
  <div className="mb-4">
    <h2 className="text-lg font-medium">{title}</h2>
    <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
  </div>
);

const Field = ({
  label, id, value, onChange, type = "text", placeholder, hint,
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; type?: string; placeholder?: string; hint?: string;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="rounded-xl"
      placeholder={placeholder}
      autoComplete="off"
    />
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const AdminSettings = () => {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [dirty, setDirty] = useState(false);

  const update = (key: keyof Settings) => (value: string) => {
    setSettings(s => ({ ...s, [key]: value }));
    setDirty(true);
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setDirty(false);
    toast({ title: "Налаштування збережено" });
  };

  const reset = () => {
    if (!confirm("Скинути всі налаштування до початкових значень?")) return;
    setSettings({ ...defaults });
    localStorage.removeItem(STORAGE_KEY);
    setDirty(false);
    toast({ title: "Налаштування скинуто" });
  };

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  return (
    <div className="space-y-8 max-w-2xl">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl">Налаштування</h1>
          <p className="text-muted-foreground text-sm mt-1">Конфігурація магазину та інтеграцій</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full gap-2" onClick={reset}>
            <RefreshCw className="h-4 w-4" /> Скинути
          </Button>
          <Button
            className="rounded-full btn-caramel border-0 gap-2"
            onClick={save}
            disabled={!dirty}
          >
            <Save className="h-4 w-4" /> Зберегти
          </Button>
        </div>
      </header>

      {/* General */}
      <div className="rounded-2xl bg-card border border-border/60 p-6 space-y-4">
        <SectionHeader title="Загальне" desc="Основна інформація про магазин" />
        <Field label="Назва магазину" id="siteName" value={settings.siteName} onChange={update("siteName")} placeholder="BodyHome" />
        <Field label="Телефон" id="phone" value={settings.phone} onChange={update("phone")} placeholder="+380..." hint="Відображається у шапці та підвалі сайту" />
        <Field label="Email" id="email" value={settings.email} onChange={update("email")} type="email" placeholder="bodyhome@gmail.com" />
        <Field label="Telegram" id="telegram" value={settings.telegram} onChange={update("telegram")} placeholder="@bodyhomeua" />
      </div>

      {/* Nova Poshta */}
      <div className="rounded-2xl bg-card border border-border/60 p-6 space-y-4">
        <SectionHeader title="Нова Пошта" desc="API ключ для автозаповнення міст і відділень" />
        <Field
          label="API ключ Нової Пошти"
          id="npApiKey"
          value={settings.npApiKey}
          onChange={update("npApiKey")}
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          hint="Отримати на business.novaposhta.ua у розділі Налаштування → Безпека"
        />
      </div>

      {/* Telegram Bot */}
      <div className="rounded-2xl bg-card border border-border/60 p-6 space-y-4">
        <SectionHeader title="Telegram бот" desc="Сповіщення про нові замовлення в Telegram" />
        <Field
          label="Bot Token"
          id="telegramBotToken"
          value={settings.telegramBotToken}
          onChange={update("telegramBotToken")}
          placeholder="123456:ABC-DEF..."
          hint="Отримати у @BotFather командою /newbot або /token"
        />
      </div>

      {/* LiqPay */}
      <div className="rounded-2xl bg-card border border-border/60 p-6 space-y-4">
        <SectionHeader title="LiqPay" desc="Налаштування онлайн оплати (Visa, Mastercard, Apple Pay)" />
        <Field
          label="Public Key"
          id="liqpayPublicKey"
          value={settings.liqpayPublicKey}
          onChange={update("liqpayPublicKey")}
          placeholder="i21815439512"
          hint="Публічний ключ з особистого кабінету LiqPay"
        />
        <Field
          label="Private Key"
          id="liqpayPrivateKey"
          value={settings.liqpayPrivateKey}
          onChange={update("liqpayPrivateKey")}
          type="password"
          placeholder="••••••••"
          hint="Приватний ключ — зберігається у змінних середовища Vercel (LIQPAY_PRIVATE_KEY)"
        />
      </div>

      {dirty && (
        <div className="flex justify-end">
          <Button className="rounded-full btn-caramel border-0 gap-2" onClick={save}>
            <Save className="h-4 w-4" /> Зберегти зміни
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
