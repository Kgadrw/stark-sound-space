import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Music4, User, MapPin, Menu, X, Instagram, Twitter, Youtube, Sparkles, Clapperboard, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/context/ContentContext";

type NavbarNavLink = {
  label: string;
  icon: LucideIcon;
  to: string;
};

type NavbarProps = {
  variant?: "frontend" | "admin";
};

const frontendNavLinks: NavbarNavLink[] = [
  { label: "Home", to: "/", icon: Home },
  { label: "Albums", to: "/music", icon: Music4 },
  { label: "Videos", to: "/videos", icon: Clapperboard },
  { label: "About", to: "/about", icon: User },
  { label: "Tours", to: "/tours", icon: MapPin },
];

const adminNavLinks: NavbarNavLink[] = [
  { label: "Hero", icon: Sparkles, to: "/administrationneln" },
  { label: "Albums", icon: Music4, to: "/administrationneln/albums" },
  { label: "Videos", icon: Clapperboard, to: "/administrationneln/videos" },
  { label: "About", icon: User, to: "/administrationneln/about" },
  { label: "Tours", icon: MapPin, to: "/administrationneln/tours" },
  { label: "Account", icon: Home, to: "/administrationneln/account" },
];

const waveHeights = [8, 14, 24, 35, 24, 14, 8];

const waveAnimation = `
  @keyframes wavePulse {
    0%, 100% { transform: scaleY(0.7); opacity: 0.6; }
    50% { transform: scaleY(1.2); opacity: 1; }
  }
`;

const Navbar = ({ variant = "frontend" }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { content } = useContent();
  const navigate = useNavigate();
  const navLinks = variant === "admin" ? adminNavLinks : frontendNavLinks;
  const latestAlbumName = content.hero.latestAlbumName || "VIBRANIUM";
  const latestAlbumLink = content.hero.latestAlbumLink || "/music";

  useEffect(() => {
    const animated = sessionStorage.getItem("navbarAnimated");
    if (animated === "true") {
      setHasAnimated(true);
    } else {
      sessionStorage.setItem("navbarAnimated", "true");
    }
  }, []);

  return (
    <>
      <style>{waveAnimation}</style>
      <motion.nav
        initial={hasAnimated ? false : { y: -100, opacity: 0 }}
        animate={hasAnimated ? false : { y: 0, opacity: 1 }}
        transition={hasAnimated ? {} : { duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-black px-6 py-4 text-white"
      >
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate("/")}
            className="relative cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Go to homepage"
          >
            <div className="text-lg md:text-xl font-bold tracking-[0.3em] relative z-10">
              NEL NGABO
            </div>
            {/* Glitch effect text shadow */}
            <div
              className="text-lg md:text-xl font-bold tracking-[0.3em] absolute top-0 left-0 opacity-50 text-gray-medium"
              style={{
                transform: "translate(2px, 2px)",
              }}
              aria-hidden="true"
            >
              NEL NGABO
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              end={variant === "admin" && to === "/administrationneln"}
              className={({ isActive }) =>
                [
                  "px-4 py-2 text-sm uppercase tracking-[0.2em] transition",
                  isActive ? "text-white" : "text-white/60 hover:text-white",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <span className={isActive ? "underline decoration-white decoration-2 underline-offset-8" : ""}>
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-2 text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Latest Release (Desktop only, frontend variant) */}
        {variant === "frontend" && (
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2">
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
              <div className="text-[0.65rem] font-semibold tracking-[0.3em] text-white">
                {latestAlbumName}
              </div>
            </div>
            <Button variant="secondary" asChild className="uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-transform text-xs px-3 py-1.5">
              <a 
                href={latestAlbumLink.startsWith('http') ? latestAlbumLink : `https://${latestAlbumLink}`}
                target={latestAlbumLink.startsWith('http') ? '_blank' : undefined}
                rel={latestAlbumLink.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                Listen
              </a>
            </Button>
          </div>
        )}
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black text-white flex flex-col p-6 space-y-8 md:hidden"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between text-xs uppercase tracking-[0.4em]"
            >
              <button
                onClick={() => {
                  navigate("/");
                  setIsMobileMenuOpen(false);
                }}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                aria-label="Go to homepage"
              >
                NEL NGABO
              </button>
              <motion.button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 text-white"
                aria-label="Close menu"
              >
                Close
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>
            <nav className="flex flex-col gap-6 text-3xl font-bold tracking-[0.2em]">
              {navLinks.map(({ to, label }, index) => (
                <motion.div
                  key={label}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <NavLink
                    to={to}
                    end={variant === "admin" && to === "/administrationneln"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      [
                        "uppercase transition relative",
                        isActive ? "text-white underline decoration-white decoration-2 underline-offset-8" : "text-white/60 hover:text-white",
                      ].join(" ")
                    }
                  >
                    {label}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

