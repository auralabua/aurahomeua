import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SupportWidget } from "./SupportWidget";
import { TelegramPopup } from "./TelegramPopup";

export const Layout = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary focus:shadow-elevated focus:outline-none"
    >
      Перейти до основного вмісту
    </a>
    <Navbar />
    <main id="main-content" className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <SupportWidget />
    <TelegramPopup />
  </div>
);
