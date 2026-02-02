import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, User, MapPin, Menu, X, Instagram, Twitter, Youtube, Sparkles, Clapperboard, Music4, Mail, type LucideIcon } from "lucide-react";
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
  { label: "MUSIC", to: "/audio-music", icon: Music4 },
  { label: "VIDEO", to: "/videos", icon: Clapperboard },
  { label: "ABOUT", to: "/about", icon: User },
  { label: "EVENTS", to: "/tours", icon: MapPin },
];

const adminNavLinks: NavbarNavLink[] = [
  { label: "Hero", icon: Sparkles, to: "/administrationneln" },
  { label: "Albums", icon: Music4, to: "/administrationneln/albums" },
  { label: "Videos", icon: Clapperboard, to: "/administrationneln/videos" },
  { label: "About", icon: User, to: "/administrationneln/about" },
  { label: "Events", icon: MapPin, to: "/administrationneln/tours" },
  { label: "Account", icon: Home, to: "/administrationneln/account" },
];




const Navbar = ({ variant = "frontend" }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { content } = useContent();
  const navigate = useNavigate();
  const navLinks = variant === "admin" ? adminNavLinks : frontendNavLinks;
  

  useEffect(() => {
    const animated = sessionStorage.getItem("navbarAnimated");
    if (animated === "true") {
      setHasAnimated(true);
    } else {
      sessionStorage.setItem("navbarAnimated", "true");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      
      // Check if we're on mobile (viewport width < 768px)
      const isMobile = window.innerWidth < 768;
      
      // On mobile, always show navbar
      if (isMobile) {
        setIsVisible(true);
      } else {
        // Desktop: Hide navbar when scrolling down, show when scrolling up or at top
        if (scrollPosition < 10) {
          // Always show at the top
          setIsVisible(true);
        } else if (scrollPosition > lastScrollY.current) {
          // Scrolling down - hide navbar
          setIsVisible(false);
        } else if (scrollPosition < lastScrollY.current) {
          // Scrolling up - show navbar
          setIsVisible(true);
        }
      }
      
      lastScrollY.current = scrollPosition;
    };

    const handleResize = () => {
      // On mobile, always show navbar
      if (window.innerWidth < 768) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <>
      <motion.nav
        initial={hasAnimated ? false : { y: -100, opacity: 0 }}
        animate={hasAnimated ? (isVisible ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }) : { y: 0, opacity: 1 }}
        transition={hasAnimated ? { duration: 0.3, ease: "easeInOut" } : { duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex h-auto items-center justify-between px-6 py-3 text-white transition-all duration-300 bg-black"
        style={{
          backdropFilter: isScrolled ? "blur(10px)" : "none",
        }}
      >
        {/* Logo/Brand - Left */}
        <div className="relative z-10 flex items-center">
          <button
            onClick={() => navigate("/")}
            className="relative cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Go to homepage"
          >
            <img 
              src="/logo.png" 
              alt="NEL NGABO" 
              className="h-8 md:h-10 w-auto"
            />
          </button>
        </div>

        {/* Desktop Navigation - Center */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isHashLink = to.includes('#');
            const handleClick = (e: React.MouseEvent) => {
              if (isHashLink) {
                e.preventDefault();
                const hash = to.split('#')[1];
                if (hash) {
                  const element = document.getElementById(hash);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/');
                    setTimeout(() => {
                      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }
              }
            };

            if (isHashLink) {
              return (
                <button
                  key={label}
                  onClick={handleClick}
                  className="px-4 py-2 text-lg lg:text-xl xl:text-2xl uppercase tracking-[0.15em] transition text-white/70 hover:text-white font-bold"
                >
                  {label}
                </button>
              );
            }

            return (
              <NavLink
                key={label}
                to={to}
                end={variant === "admin" && to === "/administrationneln"}
                className={({ isActive }) =>
                  [
                    "px-4 py-2 text-lg lg:text-xl xl:text-2xl uppercase tracking-[0.15em] transition font-bold",
                    isActive ? "text-white" : "text-white/70",
                    "hover:text-white",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <span className={isActive ? "font-bold" : ""}>
                    {label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Email Icon - Right (Desktop only) */}
        <div className="relative z-10 hidden md:flex items-center">
          <a
            href="mailto:nelngabo1@gmail.com"
            className="text-lg lg:text-xl xl:text-2xl text-white/70 hover:text-white transition font-bold"
            aria-label="Email"
          >
            <Mail className="h-6 w-6 lg:h-7 lg:w-7 xl:h-8 xl:w-8" />
          </a>
        </div>

        {/* Menu Button - Top Right (Mobile only) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="relative z-10 flex items-center gap-2 text-white touch-manipulation min-w-[44px] min-h-[44px] justify-center md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

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
                <img 
                  src="/logo.png" 
                  alt="NEL NGABO" 
                  className="h-8 w-auto"
                />
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
            <nav className="flex flex-col gap-4 sm:gap-6 text-2xl sm:text-3xl font-bold tracking-[0.2em]">
              {navLinks.map(({ to, label }, index) => {
                const isHashLink = to.includes('#');
                const handleClick = (e: React.MouseEvent) => {
                  setIsMobileMenuOpen(false);
                  if (isHashLink) {
                    e.preventDefault();
                    const hash = to.split('#')[1];
                    if (hash) {
                      const element = document.getElementById(hash);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate('/');
                        setTimeout(() => {
                          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }
                  }
                };

                if (isHashLink) {
                  return (
                    <motion.div
                      key={label}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <button
                        onClick={handleClick}
                        className="uppercase transition relative text-white/60 hover:text-white touch-manipulation min-h-[44px] text-left"
                      >
                        {label}
                      </button>
                    </motion.div>
                  );
                }

                return (
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
                          "uppercase transition relative touch-manipulation min-h-[44px] flex items-center",
                          isActive ? "text-white font-bold" : "text-white/60",
                          "hover:text-white",
                        ].join(" ")
                      }
                    >
                      {label}
                    </NavLink>
                  </motion.div>
                );
              })}
            </nav>
            {variant === "frontend" && (
              <>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-4"
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
                        transition={{ delay: 0.9 + index * 0.1, type: "spring" }}
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon className="h-6 w-6" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
