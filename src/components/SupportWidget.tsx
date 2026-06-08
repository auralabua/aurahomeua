import { useState } from "react";
import { MessageCircle, X, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TG_TOKEN = import.meta.env.VITE_TG_TOKEN || "8632833094:AAF6DCv98UfUj3qu4qinE64ILwp6swJMPLo";
const TG_CHAT  = import.meta.env.VITE_TG_CHAT  || "5119568271";
const TG_LINK  = "https://t.me/BodyHome1";

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z" />
  </svg>
);

function isOnline() {
  const h = (new Date().getUTCHours() + 3) % 24;
  return h >= 9 && h < 21;
}

export const SupportWidget = () => {
  const [open, setOpen]       = useState(false);
  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [msg, setMsg]         = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  const online = isOnline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const { error: dbErr } = await (supabase as any)
        .from("support_requests")
        .insert({ name, phone, message: msg });
      if (dbErr) throw dbErr;

      const now = new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kiev" });
      const text = `💬 Нове звернення в підтримку\n\n👤 ${name}\n📞 ${phone}\n💭 ${msg}\n\n⏰ ${now}`;
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TG_CHAT, text }),
      }).catch(() => {});

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setName(""); setPhone(""); setMsg("");
      }, 3000);
    } catch {
      setError("Помилка. Спробуйте ще раз або напишіть у Telegram.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* ── Popup ───────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed z-50 left-4 right-4 bottom-24
                     sm:left-auto sm:right-6 sm:w-80
                     animate-in slide-in-from-bottom-4 fade-in duration-200"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-border/30 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
              <div>
                <p className="text-sm font-semibold">💬 Підтримка BodyHome</p>
                <p className="text-xs opacity-80">Оберіть зручний спосіб</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Закрити"
                className="rounded-full p-1 hover:bg-white/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">

              {/* Online status */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`h-2 w-2 rounded-full shrink-0 ${online ? "bg-green-500" : "bg-gray-400"}`} />
                {online ? "Онлайн · відповімо швидко" : "Не в мережі · відповімо вранці"}
              </div>

              {/* Telegram option */}
              <a
                href={TG_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full rounded-xl bg-[#229ED9] px-4 py-3 text-white hover:bg-[#1a8bbf] transition-colors"
              >
                <TelegramIcon />
                <div>
                  <p className="text-sm font-semibold leading-tight">Написати в Telegram</p>
                  <p className="text-xs opacity-80">Відповідь протягом 3–5 хвилин</p>
                </div>
              </a>

              {/* Divider */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex-1 h-px bg-border" />
                <span>або</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Form / Success */}
              {sent ? (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <CheckCircle2 className="h-9 w-9 text-green-500" />
                  <p className="text-sm font-medium">Дякуємо!</p>
                  <p className="text-xs text-muted-foreground">
                    Ми зв'яжемось з вами найближчим часом
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ваше ім'я"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                  <input
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Телефон +380..."
                    type="tel"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                  <textarea
                    required
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    placeholder="Ваше питання..."
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors resize-none"
                  />
                  {error && (
                    <p className="text-xs text-destructive">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors"
                  >
                    {sending
                      ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      : <Send className="h-4 w-4" />
                    }
                    {sending ? "Надсилаємо…" : "Надіслати повідомлення"}
                  </button>
                </form>
              )}

              {/* Working hours */}
              <p className="text-center text-[11px] text-muted-foreground pt-1">
                Пн–Нд: 9:00 – 21:00
              </p>

            </div>
          </div>
        </div>
      )}

      {/* ── Floating button ─────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25 pointer-events-none" />
        )}
        <button
          onClick={() => setOpen(v => !v)}
          aria-label={open ? "Закрити підтримку" : "Відкрити підтримку"}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>
    </>
  );
};
