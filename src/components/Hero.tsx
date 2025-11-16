 reimport { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Play, Music3, Music4, Disc3, Youtube, Radio, Search, Phone, Mail, Instagram, Twitter, Music2, Facebook, Globe } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import type { HeroCta, HeroNavLink, IconPreset } from "@/types/content";

type PlatformSearchItem = {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  description?: string;
  targetId?: string;
  elementId?: string;
  externalUrl?: string;
};

const BASE_SEARCH_ITEMS: PlatformSearchItem[] = [
  {
    id: "section-music",
    label: "Music Catalog",
    category: "Section",
    targetId: "music",
    description: "Explore every album and track released so far.",
    keywords: ["music", "albums", "tracks", "discography"],
  },
  {
    id: "section-videos",
    label: "Video Library",
    category: "Section",
    targetId: "videos",
    description: "Watch latest releases, live sessions, and behind the scenes.",
    keywords: ["videos", "youtube", "live", "behind the scenes"],
  },
  {
    id: "section-tours",
    label: "Upcoming Tours",
    category: "Section",
    targetId: "tours",
    description: "See the full schedule and get tickets.",
    keywords: ["tour", "tickets", "schedule", "live"],
  },
];

const iconMap: Record<IconPreset, LucideIcon> = {
  spotify: Music4,
  appleMusic: Disc3,
  youtube: Youtube,
  soundcloud: Radio,
  tiktok: Music2,
  instagram: Instagram,
  x: Twitter,
  facebook: Facebook,
  mail: Mail,
  phone: Phone,
  website: Globe,
};

const resolveIcon = (preset: IconPreset) => iconMap[preset] ?? Globe;

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dynamicSearchItems, setDynamicSearchItems] = useState<PlatformSearchItem[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { content } = useContent();
  const navigate = useNavigate();

  const heroContent = content.hero;
  const heroNavLinks = heroContent.navLinks ?? [];
  const streamingPlatforms = heroContent.streamingPlatforms ?? [];
  const socialLinks = heroContent.socialLinks ?? [];
  const heroImage = heroContent.backgroundImage || "/hero.jpeg";
  const heroName = heroContent.artistName || "NEL NGABO";
  const primaryCta: HeroCta = heroContent.primaryCta ?? {
    label: "Explore Music",
    targetType: "scroll",
    targetValue: "music",
  };
  const secondaryCta = heroContent.secondaryCta ?? {
    label: "Watch Now",
    url: "https://www.youtube.com/",
  };

  const hiddenStreamingPresets: IconPreset[] = ["tiktok", "instagram", "x", "facebook", "mail", "phone"];
  const visibleStreamingPlatforms = streamingPlatforms.filter((platform) => !hiddenStreamingPresets.includes(platform.preset));

  const handleTargetAction = (targetType: HeroNavLink["targetType"] | HeroCta["targetType"], targetValue: string) => {
    if (!targetValue) return;
    if (targetType === "scroll") {
      document.getElementById(targetValue)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (targetType === "route") {
      navigate(targetValue);
      return;
    }
    if (targetType === "external") {
      window.location.href = targetValue;
      return;
    }
    window.open(targetValue, "_blank", "noopener,noreferrer");
  };

  const handleHeroNav = (nav: HeroNavLink) => handleTargetAction(nav.targetType, nav.targetValue);
  const handleHeroCta = (cta: HeroCta) => handleTargetAction(cta.targetType, cta.targetValue);

  useEffect(() => {
    const collectDynamicItems = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-search-item]"));
      const items: PlatformSearchItem[] = elements.map((element, index) => {
        const keywords =
          element.dataset.searchKeywords?.split("|").map((keyword) => keyword.trim()).filter(Boolean) ?? [];
        return {
          id: element.dataset.searchId ?? element.id ?? `dynamic-${index}`,
          label: element.dataset.searchLabel ?? "Untitled",
          category: element.dataset.searchCategory ?? "Content",
          description: element.dataset.searchDescription,
          keywords,
          targetId: element.dataset.searchTarget,
          elementId: element.dataset.searchTargetElement ?? element.id,
          externalUrl: element.dataset.searchExternalUrl,
        };
      });
      setDynamicSearchItems(items);
    };

    collectDynamicItems();
  }, []);

  const searchIndex = useMemo(() => {
    const project = (item: PlatformSearchItem) => ({
      ...item,
      searchText: `${item.label} ${item.category} ${item.description ?? ""} ${item.keywords.join(" ")}`.toLowerCase(),
    });
    return [...BASE_SEARCH_ITEMS.map(project), ...dynamicSearchItems.map(project)];
  }, [dynamicSearchItems]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return searchIndex.slice(0, 6);
    const query = searchQuery.toLowerCase();
    return searchIndex.filter((item) => item.searchText.includes(query)).slice(0, 8);
  }, [searchQuery, searchIndex]);

  const handleNavigate = (item: typeof searchIndex[number]) => {
    if (item.externalUrl) {
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (item.targetId) {
      document.getElementById(item.targetId)?.scrollIntoView({ behavior: "smooth" });
    }
    if (item.elementId) {
      document.getElementById(item.elementId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    const topMatch = filteredSuggestions[0];
    if (topMatch) {
      handleNavigate(topMatch);
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(trimmedQuery)}`, "_blank", "noopener,noreferrer");
    }
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    } else {
      searchInputRef.current?.blur();
    }
  }, [isSearchOpen]);

  const glowStyle = `
    @keyframes glow {
      0%, 100% {
        text-shadow: 0 0 5px rgba(236, 72, 153, 0.5), 0 0 10px rgba(236, 72, 153, 0.3);
        filter: drop-shadow(0 0 5px rgba(236, 72, 153, 0.5)) drop-shadow(0 0 10px rgba(236, 72, 153, 0.3));
      }
      50% {
        text-shadow: 0 0 15px rgba(236, 72, 153, 0.8), 0 0 25px rgba(236, 72, 153, 0.6);
        filter: drop-shadow(0 0 15px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 25px rgba(236, 72, 153, 0.6));
      }
    }
    .play-icon-glow {
      animation: glow 2s ease-in-out infinite;
    }
  `;

  return (
    <>
      <style>{glowStyle}</style>
    <section className="relative h-screen w-full overflow-hidden border-0 p-4 bg-black">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute right-6 top-6 z-20 flex items-center gap-3"
      >
        <motion.button
          type="button"
          onClick={() => setIsSearchOpen((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex h-10 w-10 items-center justify-center border border-white/40 bg-black/80 text-white shadow-lg transition hover:border-white hover:bg-black ${
            isSearchOpen ? "border-white bg-black" : ""
          }`}
          aria-label="Toggle search"
        >
          <Search className="h-4 w-4" strokeWidth={2.5} />
        </motion.button>
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <form
                onSubmit={handleSearch}
                className="flex items-center border border-white/20 bg-black/80 px-4 py-2 text-white backdrop-blur-xl shadow-lg"
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search anything..."
                  className="w-36 sm:w-52 bg-transparent text-xs uppercase tracking-[0.3em] text-white placeholder:text-white/30 focus:outline-none"
                  onBlur={(event) => {
                    // delay closing to allow suggestion click
                    setTimeout(() => {
                      const nextTarget = event.relatedTarget as HTMLElement | null;
                      if (!nextTarget?.classList.contains("search-suggestion")) {
                        setIsSearchOpen(false);
                      }
                    }, 120);
                  }}
                />
              </form>
              <AnimatePresence>
                {filteredSuggestions.length > 0 ? (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 w-full divide-y divide-white/10 border border-white/10 bg-black/95 text-white shadow-2xl"
                  >
                    {filteredSuggestions.map((item, index) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          type="button"
                          className="search-suggestion block w-full px-4 py-3 text-left transition hover:bg-white/10"
                          onClick={() => {
                            handleNavigate(item);
                            setSearchQuery("");
                            setIsSearchOpen(false);
                          }}
                        >
                          <p className="text-[0.55rem] uppercase tracking-[0.35em] text-white/50">{item.category}</p>
                          <p className="text-sm font-semibold tracking-wide text-white">{item.label}</p>
                          {item.description && (
                            <p className="text-[0.65rem] text-white/60">{item.description}</p>
                          )}
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : (
                  searchQuery.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full mt-2 w-full border border-white/10 bg-black/95 px-4 py-3 text-xs uppercase tracking-[0.25em] text-white/60 shadow-2xl"
                    >
                      <p>No matching content on the platform.</p>
                      <button
                        type="button"
                        className="mt-2 underline"
                        onClick={() => {
                          window.open(
                            `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        Search on Google
                      </button>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 overflow-hidden">
        {/* Fallback background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* YouTube background video */}
        <iframe
          className="absolute top-1/2 left-1/2 w-[177.77777778vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover z-0"
          src="https://www.youtube.com/embed/lBnokNKI38I?autoplay=1&mute=1&loop=1&playlist=lBnokNKI38I&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&cc_load_policy=0&fs=0&disablekb=1"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ pointerEvents: "none" }}
          title="Background Video"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10 pointer-events-none" />
      </div>
      <div className="relative z-20 h-full flex items-end justify-between pb-20 px-4 sm:px-8 lg:px-12 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6 max-w-2xl text-center sm:text-left mx-auto sm:mx-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
          >
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tighter relative z-10"
              style={{ fontFamily: '"Kablammo", "Oi", cursive' }}
            >
              {heroName}
            </h1>
            {/* Glitch effect text shadow */}
            <h1
              className="hidden sm:block text-5xl md:text-7xl lg:text-8xl font-normal tracking-tighter absolute top-0 left-0 opacity-50 text-gray-medium"
              style={{
                transform: "translate(2px, 2px)",
                fontFamily: '"Kablammo", "Oi", cursive',
              }}
              aria-hidden="true"
            >
              {heroName}
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 pt-4 items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                size="lg"
                className="text-lg px-8 group relative overflow-hidden"
                onClick={() => handleHeroCta(primaryCta)}
              >
                <span className="relative z-10">{primaryCta.label}</span>
                <div className="absolute inset-0 bg-foreground/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 group relative overflow-hidden">
                <a
                  href={secondaryCta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative flex items-center justify-center"
                >
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 opacity-0 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300 transform origin-center" />
                  <Play className="w-5 h-5 mr-2 fill-pink-500 text-pink-500 play-icon-glow" />
                  <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
                    {secondaryCta.label}
                  </span>
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:flex flex-col items-end gap-4"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.5em] text-white/50"
          >
            <Music3 className="h-4 w-4" />
            Streaming
          </motion.p>
          {visibleStreamingPlatforms.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col gap-3 text-sm tracking-[0.25em] text-white/70"
            >
              {visibleStreamingPlatforms.map((platform, index) => {
                const Icon = resolveIcon(platform.preset);
                return (
                  <motion.a
                    key={platform.id}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ x: -5 }}
                    className="flex items-center gap-3 hover:text-white transition"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{platform.label}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isSearchOpen ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-3 gap-3 ${isSearchOpen ? "pointer-events-none" : ""}`}
          >
            {socialLinks.map((link, index) => {
              const Icon = resolveIcon(link.preset);
              const isExternal = link.url.startsWith("http");
              return (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-10 w-10 items-center justify-center border border-white/30 bg-transparent text-white shadow-lg transition hover:border-white hover:text-foreground"
                  aria-label={link.label}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
    </>
  );
};

export default Hero;
