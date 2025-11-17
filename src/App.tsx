import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/context/SidebarContext";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import Music from "./pages/Music";
import About from "./pages/About";
import Tours from "./pages/Tours";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import HeroAdmin from "./pages/admin/HeroAdmin";
import AlbumsAdmin from "./pages/admin/AlbumsAdmin";
import ToursAdmin from "./pages/admin/ToursAdmin";
import AboutAdmin from "./pages/admin/AboutAdmin";
import AdminLogin from "./pages/admin/AdminLogin";
import AccountAdmin from "./pages/admin/AccountAdmin";
import RequireAdmin from "@/components/RequireAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/music" element={<Music />} />
          <Route path="/about" element={<About />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          >
            <Route index element={<HeroAdmin />} />
            <Route path="hero" element={<HeroAdmin />} />
            <Route path="albums" element={<AlbumsAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="tours" element={<ToursAdmin />} />
            <Route path="account" element={<AccountAdmin />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <CookieConsent />
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
