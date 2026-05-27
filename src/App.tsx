import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { Layout } from "@/components/Layout";

// Eager-load for critical above-the-fold pages
import Index from "./pages/Index.tsx";

// Lazy-load all other pages (code-splitting)
const Catalog = lazy(() => import("./pages/Catalog.tsx"));
const ProductPage = lazy(() => import("./pages/ProductPage.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contacts = lazy(() => import("./pages/Contacts.tsx"));
const Delivery = lazy(() => import("./pages/Delivery.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const PublicOffer = lazy(() => import("./pages/PublicOffer.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const BlogList = lazy(() => import("./pages/blog/BlogList"));
const BlogPost = lazy(() => import("./pages/blog/BlogPost"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.tsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.tsx"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories.tsx"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers.tsx"));

// Page loader skeleton (minimal flicker)
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is fresh for 5 minutes — no refetch on every navigation
      staleTime: 5 * 60 * 1000,
      // Keep inactive queries in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry once on failure
      retry: 1,
      // Don't refetch when window gets focus (avoids surprise refetches)
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/public-offer" element={<PublicOffer />} />
              </Route>
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="customers" element={<AdminCustomers />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
