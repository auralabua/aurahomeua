import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const TELEGRAM = "https://t.me/bodyhomeua";

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.496.969z"/>
  </svg>
);

export const Layout = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />

    {/* Floating Telegram button */}
    <a
      href={TELEGRAM}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написати в Telegram"
      className="fixed bottom-5 right-4 sm:right-5 z-40 flex items-center gap-2 rounded-full bg-[#0088cc] pl-3 pr-4 py-3 text-white shadow-xl hover:bg-[#0077b5] hover:-translate-y-1 hover:shadow-2xl transition-all duration-200"
    >
      <TelegramIcon />
      <span className="text-sm font-semibold">Telegram</span>
    </a>
  </div>
);
