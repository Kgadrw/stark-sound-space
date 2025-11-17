import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Music4, Clapperboard, MapPin, Menu, X, Instagram, Twitter, Youtube, Sparkles, User, LogOut, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";

type SidebarNavLink = {
  label: string;
  icon: LucideIcon;
  to: string;
};

type SidebarProps = {
  variant?: "frontend" | "admin";
};

const frontendNavLinks: SidebarNavLink[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Albums", to: "/music", icon: Music4 },
  { label: "Videos", to: "/videos", icon: Clapperboard },
  { label: "Tours", to: "/tours", icon: MapPin },
];

const adminNavLinks: SidebarNavLink[] = [
  { label: "Hero", icon: Sparkles, to: "/admin" },
  { label: "Albums", icon: Music4, to: "/admin/albums" },
  { label: "About", icon: User, to: "/admin/about" },
  { label: "Tours", icon: MapPin, to: "/admin/tours" },
  { label: "Account", icon: Home, to: "/admin/account" },
];

const waveHeights = [8, 14, 24, 35, 24, 14, 8];

const waveAnimation = `
  @keyframes wavePulse {
    0%, 100% { transform: scaleY(0.7); opacity: 0.6; }
    50% { transform: scaleY(1.2); opacity: 1; }
  }
`;

const Sidebar = ({ variant = "frontend" }: SidebarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { isHidden, setIsHidden } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const navLinks = variant === "admin" ? adminNavLinks : frontendNavLinks;

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  useEffect(() => {
    const animated = sessionStorage.getItem("sidebarAnimated");
    if (animated === "true") {
      setHasAnimated(true);
    } else {
      sessionStorage.setItem("sidebarAnimated", "true");
    }
  }, []);

  const handleMouseEnterLeft = () => {
    if (isHidden) {
      setIsHidden(false);
    }
  };

  return (
    <>
      <style>{waveAnimation}</style>
      <motion.aside
        initial={hasAnimated ? false : { x: -100, opacity: 0 }}
        animate={hasAnimated ? false : { x: 0, opacity: 1 }}
        transition={hasAnimated ? {} : { duration: 0.5 }}
        className={`fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-white/10 bg-black/80 px-8 py-10 text-white backdrop-blur-xl md:flex transition-transform duration-300 ease-in-out ${
          isHidden ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-white/50">Artist</p>
          <div className="relative">
            <div className="text-2xl md:text-3xl font-bold tracking-[0.45em] relative z-10">
              NEL NGABO
            </div>
            {/* Glitch effect text shadow */}
            <div
              className="text-2xl md:text-3xl font-bold tracking-[0.45em] absolute top-0 left-0 opacity-50 text-gray-medium"
              style={{
                transform: "translate(2px, 2px)",
              }}
              aria-hidden="true"
            >
              NEL NGABO
            </div>
          </div>
        </div>
        <nav className="mt-12 flex flex-1 flex-col gap-3">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              end={variant === "admin" && to === "/admin"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 px-4 py-3 text-sm uppercase tracking-[0.3em] transition",
                  isActive ? "text-white" : "text-white/60 hover:text-white",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <span className={isActive ? "underline decoration-white decoration-2 underline-offset-8 flex items-center gap-3" : "flex items-center gap-3"}>
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        {variant === "frontend" && (
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Latest release</p>
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="flex flex-1 items-center gap-2">
                <div className="flex items-end gap-[2px]">
                  {waveHeights.map((height, index) => (
                    <span
                      key={index}
                      className="w-[3px] rounded-full bg-gradient-to-t from-pink-500 via-purple-500 to-sky-500"
                      style={{
                        height: `${height * 0.6}px`,
                        animation: "wavePulse 1.4s ease-in-out infinite",
                        animationDelay: `${index * 60}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-[0.6rem] font-semibold tracking-[0.4em] text-white">
                VIBRANIUM
              </div>
            </div>
            <Button variant="secondary" asChild className="w-full uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-transform">
              <a href="/music">Listen</a>
            </Button>
          </div>
        )}
        {variant === "admin" && (
          <div className="mt-auto pt-4 border-t border-white/10">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full flex items-center gap-3 text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm uppercase tracking-[0.2em]">Logout</span>
            </Button>
          </div>
        )}
      </motion.aside>
      <div className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/80 px-6 py-4 text-xs uppercase tracking-[0.4em] text-white/70 backdrop-blur-xl md:hidden">
        <span>{variant === "admin" ? "ADMIN" : "NEL NGABO"}</span>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-2 text-white hover:text-white/80 transition"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
          <span className="text-sm">Menu</span>
        </button>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 text-white flex flex-col p-6 space-y-8 md:hidden"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between text-xs uppercase tracking-[0.4em]"
            >
              <span>{variant === "admin" ? "ADMIN" : "NEL NGABO"}</span>
              <motion.button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 text-white hover:text-white/80 transition"
                aria-label="Close menu"
              >
                Close
                <X className="h-5 w-5" />
              </motion.button>
            </motion.div>
            <nav className="flex flex-col gap-4 text-2xl font-bold tracking-[0.2em]">
              {navLinks.map(({ to, label, icon: Icon }, index) => (
                <motion.div
                  key={label}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <NavLink
                    to={to}
                    end={variant === "admin" && to === "/admin"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 uppercase transition relative py-2",
                        isActive ? "text-white underline decoration-white decoration-2 underline-offset-8" : "text-white/60 hover:text-white",
                      ].join(" ")
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            {variant === "frontend" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-auto space-y-4"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">Follow</p>
                <div className="flex items-center gap-4">
                  {[
                    { href: "https://www.instagram.com/nelngabo/", icon: Instagram, label: "Instagram" },
                    { href: "https://twitter.com/nelngabo", icon: Twitter, label: "Twitter" },
                    { href: "https://www.youtube.com/@nelngabo9740", icon: Youtube, label: "YouTube" },
                  ].map(({ href, icon: Icon, label }, index) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
            {variant === "admin" && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-auto pt-4 border-t border-white/10"
              >
                <motion.button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center gap-3 text-white/70 hover:text-white hover:bg-white/10 transition px-4 py-3 rounded-lg"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-lg font-semibold uppercase tracking-[0.2em]">Logout</span>
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

