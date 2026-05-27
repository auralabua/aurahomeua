/**
 * PWAInstallPrompt — shows a native-style "Add to home screen" banner.
 *
 * - Appears after 30 s on the second+ visit (not on first pageload)
 * - Dismissed state is stored in localStorage for 30 days
 * - Works on Chrome/Edge (beforeinstallprompt) + iOS Safari (manual guide)
 */
import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";

const DISMISS_KEY = "pwa_install_dismissed";
const DISMISS_DAYS = 30;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Don't show if recently dismissed
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed && Date.now() - Number(dismissed) < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;

    // iOS: show manual install guide after delay
    if (ios) {
      setIsIOS(true);
      const t = setTimeout(() => setShow(true), 30_000);
      return () => clearTimeout(t);
    }

    // Chrome/Edge: wait for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const t = setTimeout(() => setShow(true), 30_000);
      return () => clearTimeout(t);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
    dismiss();
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Встановити додаток"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[360px] z-50 animate-fade-in"
    >
      <div className="rounded-2xl border border-border/60 bg-white shadow-elevated p-4 flex gap-3">
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <Smartphone className="h-6 w-6 text-primary" strokeWidth={1.5} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug">
            Додайте BodyHome на головний екран
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 font-light leading-snug">
            {isIOS
              ? 'Натисніть "Поділитись" → "На екран Початку"'
              : "Швидкий доступ до каталогу та замовлень"}
          </p>

          {/* Action buttons */}
          {!isIOS && deferredPrompt && (
            <button
              onClick={install}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary/90 transition-colors"
            >
              <Download className="h-3 w-3" />
              Встановити
            </button>
          )}
        </div>

        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Закрити"
          className="shrink-0 self-start rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
