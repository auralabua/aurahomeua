import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SupportWidget } from "./SupportWidget";
import { TelegramPopup } from "./TelegramPopup";
import { BottomNav } from "./BottomNav";

export const Layout = () => (
  <div className="flex min-h-screen flex-col bg-background">
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary focus:shadow-elevated focus:outline-none"
    >
      Перейти до основного вмісту
    </a>
    <Navbar />
    <main id="main-content" className="flex-1 pb-14 lg:pb-0">
      <Outlet />
    </main>
    <div className="pb-14 lg:pb-0">
      <Footer />
    </div>
    <SupportWidget />
    <TelegramPopup />
    <BottomNav />
  </div>
);
