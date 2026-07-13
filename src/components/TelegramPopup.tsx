import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "bh_tg_popup_date";
const SUPPRESS_MS = 7 * 24 * 60 * 60 * 1000;
const DELAY_MS = 30_000;
const TELEGRAM = "https://t.me/BodyHome1";

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z"/>
  </svg>
);

export const TelegramPopup = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const last = localStorage.getItem(STORAGE_KEY);
    if (last && Date.now() - Number(last) < SUPPRESS_MS) return;

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 w-72 animate-fade-in">
      <div className="relative flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-elevated">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Закрити"
          className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-3 pr-6">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#2AABEE]/10 text-[#2AABEE]">
            <TelegramIcon />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground leading-snug">Маєте питання?</p>
            <p className="text-xs text-muted-foreground leading-snug mt-0.5">Пишіть нам у Telegram — відповімо швидко!</p>
          </div>
        </div>

        <a
          href={TELEGRAM}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismiss}
          className="flex items-center justify-center gap-2 rounded-full bg-[#2AABEE] py-2.5 text-sm font-medium text-white hover:bg-[#2AABEE]/90 transition-colors"
        >
          <TelegramIcon />
          Написати в Telegram
        </a>
      </div>
    </div>
  );
};
