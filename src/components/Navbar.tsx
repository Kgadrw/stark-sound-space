import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Music4, User, MapPin, Menu, X, Instagram, Twitter, Youtube, Sparkles, Clapperboard, Play, Search, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContent } from "@/context/ContentContext";
import { adminApi } from "@/lib/api";
import YouTubePlayer from "@/components/YouTubePlayer";

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
  { label: "MUSIC", to: "/audio-music", icon: Music4 },
  { label: "Albums", to: "/music", icon: Music4 },
  { label: "Videos", to: "/videos", icon: Clapperboard },
  { label: "About", to: "/about", icon: User },
  { label: "Events", to: "/tours", icon: MapPin },
];

const adminNavLinks: NavbarNavLink[] = [
  { label: "Hero", icon: Sparkles, to: "/administrationneln" },
  { label: "Albums", icon: Music4, to: "/administrationneln/albums" },
  { label: "Videos", icon: Clapperboard, to: "/administrationneln/videos" },
  { label: "About", icon: User, to: "/administrationneln/about" },
  { label: "Events", icon: MapPin, to: "/administrationneln/tours" },
  { label: "Account", icon: Home, to: "/administrationneln/account" },
];

const waveHeights = [8, 14, 24, 35, 24, 14, 8];

const waveAnimation = `
  @keyframes wavePulse {
    0%, 100% { transform: scaleY(0.7); opacity: 0.6; }
    50% { transform: scaleY(1.2); opacity: 1; }
  }
`;

type PlatformSearchItem = {
  id: string;
  label: string;
  category: string;
  keywords: string[];
  description?: string;
  targetId?: string;
  elementId?: string;
  externalUrl?: string;
  routeUrl?: string;
};

type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
};

const BASE_SEARCH_ITEMS: PlatformSearchItem[] = [
  {
    id: "section-music",
    label: "Music Catalog",
    category: "Section",
    targetId: "music",
    routeUrl: "/music",
    description: "Explore every album and track released so far.",
    keywords: ["music", "albums", "tracks", "discography"],
  },
  {
    id: "section-videos",
    label: "Videos",
    category: "Section",
    routeUrl: "/videos",
    description: "Watch music videos and performances.",
    keywords: ["videos", "music videos", "performances", "youtube"],
  },
  {
    id: "section-about",
    label: "About",
    category: "Section",
    routeUrl: "/about",
    description: "Learn more about the artist and their journey.",
    keywords: ["about", "artist", "biography", "info"],
  },
  {
    id: "section-tours",
    label: "Upcoming Tours",
    category: "Section",
    routeUrl: "/tours",
    description: "See the full schedule and get tickets.",
    keywords: ["tour", "tickets", "schedule", "live"],
  },
];

const Navbar = ({ variant = "frontend" }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dynamicSearchItems, setDynamicSearchItems] = useState<PlatformSearchItem[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingYouTube, setIsLoadingYouTube] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Create content-based search items from context
  const contentSearchItems = useMemo(() => {
    const items: PlatformSearchItem[] = [];

    // Add videos
    content.videos.forEach((video) => {
      items.push({
        id: `video-${video.id}`,
        label: video.title,
        category: "Video",
        description: video.description || "",
        keywords: [video.title, ...(video.description ? video.description.split(" ") : [])],
        routeUrl: `/video/${video.id}`,
      });
    });

    // Add albums
    content.albums.forEach((album) => {
      const keywords = [
        album.title,
        album.year,
        ...(album.tracks || []),
        ...(album.summary ? album.summary.split(" ") : []),
        ...(album.description ? album.description.split(" ") : []),
      ].filter(Boolean);
      
      items.push({
        id: `album-${album.id}`,
        label: album.title,
        category: "Album",
        description: `${album.year} · ${(album.tracks || []).length} tracks${album.summary ? ` · ${album.summary}` : ""}`,
        keywords,
        routeUrl: `/album/${album.id}`,
      });
    });

    // Add tours
    content.tours.forEach((tour) => {
      items.push({
        id: `tour-${tour.id}`,
        label: `${tour.city} - ${tour.venue}`,
        category: "Tour",
        description: `${tour.date} · ${tour.city}`,
        keywords: [tour.city, tour.venue, tour.date],
        routeUrl: "/tours",
      });
    });

    // Add about page if there's content
    if (content.about.biography || content.about.careerHighlights.length > 0) {
      items.push({
        id: "about-page",
        label: "About",
        category: "Page",
        description: "Learn about the artist",
        keywords: ["about", "artist", "biography", ...content.about.careerHighlights],
        routeUrl: "/about",
      });
    }

    return items;
  }, [content]);

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
          externalUrl: element.dataset.externalUrl,
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
    return [
      ...contentSearchItems.map(project),
      ...dynamicSearchItems.map(project)
    ];
  }, [dynamicSearchItems, contentSearchItems]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return searchIndex.slice(0, 6);
    const query = searchQuery.toLowerCase();
    return searchIndex.filter((item) => item.searchText.includes(query)).slice(0, 8);
  }, [searchQuery, searchIndex]);

  // Fetch YouTube results when query changes
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery || filteredSuggestions.length > 0) {
      setYoutubeVideos([]);
      return;
    }

    const searchYouTube = async () => {
      setIsLoadingYouTube(true);
      try {
        const response = await adminApi.searchYouTube(trimmedQuery);
        setYoutubeVideos(response.videos || []);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("YouTube search error");
        }
        setYoutubeVideos([]);
      } finally {
        setIsLoadingYouTube(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchYouTube();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filteredSuggestions.length]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    } else {
      searchInputRef.current?.blur();
    }
  }, [isSearchOpen]);

  const handleNavigate = (item: typeof searchIndex[number]) => {
    if (item.externalUrl) {
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (item.routeUrl) {
      navigate(item.routeUrl);
      setSearchQuery("");
      setIsSearchOpen(false);
      return;
    }
    if (item.targetId) {
      if (item.targetId.startsWith("/")) {
        navigate(item.targetId);
        setSearchQuery("");
        setIsSearchOpen(false);
        return;
      }
      document.getElementById(item.targetId)?.scrollIntoView({ behavior: "smooth" });
    }
    if (item.elementId) {
      document.getElementById(item.elementId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    const topMatch = filteredSuggestions[0];
    if (topMatch) {
      handleNavigate(topMatch);
      setSearchQuery("");
      setIsSearchOpen(false);
    } else if (youtubeVideos.length > 0) {
      setSelectedVideo({ id: youtubeVideos[0].id, title: youtubeVideos[0].title });
      setSearchQuery("");
      setIsSearchOpen(false);
    } else {
      const youtubeSearchQuery = `nel ngabo ${trimmedQuery}`;
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeSearchQuery)}`, "_blank", "noopener,noreferrer");
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <style>{waveAnimation}</style>
      <motion.nav
        initial={hasAnimated ? false : { y: -100, opacity: 0 }}
        animate={hasAnimated ? false : { y: 0, opacity: 1 }}
        transition={hasAnimated ? {} : { duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-6 py-4 text-white transition-all duration-300 bg-black"
        style={{
          backdropFilter: isScrolled ? "blur(10px)" : "none",
        }}
      >
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2">
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
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
                  className="px-4 py-2 text-sm uppercase tracking-[0.2em] transition text-white/60 hover:text-white"
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
                    "px-4 py-2 text-sm uppercase tracking-[0.2em] transition",
                    isActive ? "text-white" : "text-white/60",
                    "hover:text-white",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <span className={isActive ? "underline decoration-white decoration-2 underline-offset-8" : ""}>
                    {label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex items-center gap-2 text-white md:hidden touch-manipulation min-w-[44px] min-h-[44px] justify-center"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Latest Release (Desktop only, frontend variant) */}
        {variant === "frontend" && (
          <div className="hidden lg:flex items-center gap-4">
            <Button
              onClick={() => {
                setIsPlaying(true);
                if (latestAlbumLink.startsWith('http')) {
                  window.open(latestAlbumLink, '_blank', 'noopener,noreferrer');
                } else {
                  navigate(latestAlbumLink);
                }
              }}
              className="bg-transparent text-white hover:bg-white/10 rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 uppercase tracking-[0.2em] flex items-center gap-2"
            >
              {/* Music Waves */}
              <div className="flex items-end gap-[2px]">
                {waveHeights.map((height, index) => (
                  <span
                    key={index}
                    className="w-[3px] rounded-full bg-white"
                    style={{
                      height: `${height * 0.6}px`,
                      animation: isPlaying ? "wavePulse 1.4s ease-in-out infinite" : "none",
                      animationDelay: `${index * 60}ms`,
                    }}
                  />
                ))}
              </div>
              <span>{latestAlbumName}</span>
            </Button>
          </div>
        )}

        {/* Search Bar */}
        {variant === "frontend" && (
          <div className="hidden md:flex items-center gap-2 relative">
            <motion.button
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex h-9 w-9 items-center justify-center bg-white/10 backdrop-blur-sm text-white transition hover:bg-white/20 ${
                isSearchOpen ? "bg-white/20" : ""
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
                    className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 text-white"
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search..."
                      className="w-36 sm:w-48 bg-transparent text-xs uppercase tracking-[0.2em] text-white placeholder:text-white/40 focus:outline-none"
                      onBlur={(event) => {
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
                        className="absolute z-[200] top-full mt-2 right-0 w-full min-w-[300px] divide-y divide-white/10 bg-black/95 text-white shadow-2xl"
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
                    ) : searchQuery.trim() && (
                      youtubeVideos.length > 0 ? (
                        <motion.ul
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-[200] top-full mt-2 right-0 w-full min-w-[300px] max-h-96 overflow-y-auto divide-y divide-white/10 border-2 border-white bg-black/95 text-white shadow-2xl"
                        >
                          <li className="px-4 py-2 text-[0.55rem] uppercase tracking-[0.35em] text-white/50 border-b border-white/10">
                            YouTube Results
                          </li>
                          {youtubeVideos.map((video, index) => (
                            <motion.li
                              key={video.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <button
                                type="button"
                                className="search-suggestion block w-full px-4 py-3 text-left transition hover:bg-white/10"
                                onClick={() => {
                                  setSelectedVideo({ id: video.id, title: video.title });
                                  setSearchQuery("");
                                  setIsSearchOpen(false);
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-16 h-12 object-cover rounded flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold tracking-wide text-white truncate">{video.title}</p>
                                    <p className="text-[0.65rem] text-white/60 truncate">{video.channelTitle}</p>
                                  </div>
                                  <Youtube className="h-4 w-4 text-white/40 flex-shrink-0" />
                                </div>
                              </button>
                            </motion.li>
                          ))}
                        </motion.ul>
                      ) : isLoadingYouTube ? (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-[200] top-full mt-2 right-0 w-full min-w-[300px] border-2 border-white bg-black/95 px-4 py-3 text-xs uppercase tracking-[0.25em] text-white/60 shadow-2xl"
                        >
                          <p>Searching YouTube...</p>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-[200] top-full mt-2 right-0 w-full min-w-[300px] border-2 border-white bg-black/95 px-4 py-3 text-xs uppercase tracking-[0.25em] text-white/60 shadow-2xl"
                        >
                          <p>No matching content found.</p>
                          <button
                            type="button"
                            className="mt-2 underline"
                            onClick={() => {
                              const youtubeSearchQuery = `nel ngabo ${searchQuery}`;
                              window.open(
                                `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeSearchQuery)}`,
                                "_blank",
                                "noopener,noreferrer"
                              );
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                          >
                            Search YouTube for Nel Ngabo music
                          </button>
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
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
                          isActive ? "text-white underline decoration-white decoration-2 underline-offset-8" : "text-white/60",
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
      {selectedVideo && (
        <YouTubePlayer
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
};

export default Navbar;

