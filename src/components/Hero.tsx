import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Play, Music3, Music4, Disc3, Youtube, Radio, Search, Phone, Mail, Instagram, Twitter, Music2, Facebook, Globe } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import type { HeroCta, HeroNavLink, IconPreset } from "@/types/content";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { adminApi } from "@/lib/api";
import YouTubePlayer from "@/components/YouTubePlayer";
import NotificationBanner from "@/components/NotificationBanner";

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
    id: "section-about",
    label: "About",
    category: "Section",
    targetId: "about",
    description: "Learn more about the artist and their journey.",
    keywords: ["about", "artist", "biography", "info"],
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

const detectIconFromUrl = (url: string): IconPreset => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("instagram")) return "instagram";
  if (lowerUrl.includes("twitter") || lowerUrl.includes("x.com")) return "x";
  if (lowerUrl.includes("facebook")) return "facebook";
  if (lowerUrl.includes("tiktok")) return "tiktok";
  if (lowerUrl.includes("youtube")) return "youtube";
  if (lowerUrl.includes("spotify")) return "spotify";
  if (lowerUrl.includes("soundcloud")) return "soundcloud";
  if (lowerUrl.includes("apple") || lowerUrl.includes("music.apple")) return "appleMusic";
  if (lowerUrl.startsWith("mailto:")) return "mail";
  if (lowerUrl.startsWith("tel:")) return "phone";
  return "website";
};

type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
};

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dynamicSearchItems, setDynamicSearchItems] = useState<PlatformSearchItem[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingYouTube, setIsLoadingYouTube] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const videoIframeRef = useRef<HTMLIFrameElement>(null);
  const { content } = useContent();
  const navigate = useNavigate();

  const heroContent = content.hero;
  const heroNavLinks = heroContent.navLinks ?? [];
  const streamingPlatforms = heroContent.streamingPlatforms ?? [];
  const heroImage = heroContent.backgroundImage || "/hero.jpeg";
  const heroVideoUrl = heroContent.backgroundVideoUrl || "";
  const heroName = heroContent.artistName || "NEL NGABO";
  const notificationText = heroContent.notificationText || "";
  const notificationLink = heroContent.notificationLink || "";
  const notificationLinkText = heroContent.notificationLinkText || "Learn More";
  const isNotificationVisible = heroContent.isNotificationVisible ?? false;
  const hasNotification = isNotificationVisible && !!notificationText.trim();
  
  // Constant CTA buttons - not editable by admin
  const primaryCta: HeroCta = {
    label: "Latest Album",
    targetType: "scroll",
    targetValue: "music",
  };
  const secondaryCta = {
    label: "Watch Now",
    url: "https://www.youtube.com/",
  };

  // Only show these streaming platforms: Spotify, Apple Music, YouTube, SoundCloud
  const allowedStreamingPresets: IconPreset[] = ["spotify", "appleMusic", "youtube", "soundcloud"];
  const visibleStreamingPlatforms = streamingPlatforms.filter((platform) => allowedStreamingPresets.includes(platform.preset));

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
        console.error("YouTube search error:", error);
        setYoutubeVideos([]);
      } finally {
        setIsLoadingYouTube(false);
      }
    };

    // Debounce YouTube search
    const timeoutId = setTimeout(() => {
      searchYouTube();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filteredSuggestions.length]);

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
      setSearchQuery("");
      setIsSearchOpen(false);
    } else if (youtubeVideos.length > 0) {
      // Play first YouTube result
      setSelectedVideo({ id: youtubeVideos[0].id, title: youtubeVideos[0].title });
      setSearchQuery("");
      setIsSearchOpen(false);
    } else {
      // Fallback to YouTube search page
      const youtubeSearchQuery = `nel ngabo ${trimmedQuery}`;
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeSearchQuery)}`, "_blank", "noopener,noreferrer");
    setSearchQuery("");
    setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    } else {
      searchInputRef.current?.blur();
    }
  }, [isSearchOpen]);

  // Attempt to ensure video autoplay on mobile after iframe loads
  const handleVideoIframeLoad = () => {
    if (videoIframeRef.current?.contentWindow && heroVideoUrl) {
      // Small delay to ensure iframe API is ready
      setTimeout(() => {
        try {
          // Try to trigger play via YouTube iframe API
          videoIframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
            '*'
          );
        } catch (e) {
          // Silent fail - autoplay params in URL should handle it
        }
      }, 1000);
    }
  };

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
      <NotificationBanner
        text={notificationText}
        link={notificationLink || undefined}
        linkText={notificationLinkText}
        isVisible={isNotificationVisible && !!notificationText.trim()}
      />
    <section className="fixed inset-0 h-screen w-full overflow-hidden border-0 bg-black z-[1]">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`absolute right-4 sm:right-6 ${hasNotification ? 'top-28 sm:top-32' : 'top-20'} z-[200] flex items-center gap-2 sm:gap-3 transition-all duration-300`}
      >
        <motion.button
          type="button"
          onClick={() => setIsSearchOpen((prev) => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative z-[200] flex h-10 w-10 items-center justify-center border border-white/40 bg-black/80 backdrop-blur-sm text-white shadow-lg transition hover:border-white hover:bg-black ${
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
              className="relative z-[200]"
            >
            <form
              onSubmit={handleSearch}
                className="relative z-[200] flex items-center border border-white/20 bg-black/80 px-4 py-2 text-white backdrop-blur-xl shadow-lg"
            >
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search anything..."
                  className="relative z-[200] w-36 sm:w-52 bg-transparent text-xs uppercase tracking-[0.3em] text-white placeholder:text-white/30 focus:outline-none"
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
                    className="absolute z-[200] top-full mt-2 w-full divide-y divide-white/10 border border-white/10 bg-black/95 text-white shadow-2xl"
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
                          className="search-suggestion relative z-[200] block w-full px-4 py-3 text-left transition hover:bg-white/10"
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
                  className="absolute z-[200] top-full mt-2 w-full max-h-96 overflow-y-auto divide-y divide-white/10 border border-white/10 bg-black/95 text-white shadow-2xl"
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
                        className="search-suggestion relative z-[200] block w-full px-4 py-3 text-left transition hover:bg-white/10"
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
                  className="absolute z-[200] top-full mt-2 w-full border border-white/10 bg-black/95 px-4 py-3 text-xs uppercase tracking-[0.25em] text-white/60 shadow-2xl"
                >
                  <p>Searching YouTube...</p>
                </motion.div>
              ) : (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-[200] top-full mt-2 w-full border border-white/10 bg-black/95 px-4 py-3 text-xs uppercase tracking-[0.25em] text-white/60 shadow-2xl"
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
      </motion.div>
      <div className="absolute inset-0 overflow-hidden">
        {/* Fallback background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* YouTube background video */}
        {heroVideoUrl && getYouTubeEmbedUrl(heroVideoUrl) && (
          <iframe
            ref={videoIframeRef}
            className="absolute top-1/2 left-1/2 w-[177.77777778vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover z-0"
            src={getYouTubeEmbedUrl(heroVideoUrl) || ""}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            playsInline
            loading="eager"
            onLoad={handleVideoIframeLoad}
            style={{ pointerEvents: "none" }}
            title="Background Video"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10 pointer-events-none" />
      </div>
      <div className="relative z-20 h-full flex flex-col justify-end pb-28 sm:pb-20 md:pb-12 lg:pb-16 px-4 sm:px-6 gap-4 sm:gap-5 md:gap-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-between gap-4 sm:gap-5 md:gap-6 lg:gap-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-3 sm:space-y-4 md:space-y-5 max-w-2xl text-center lg:text-left w-full lg:w-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-3 md:gap-4 items-center justify-center lg:items-start lg:justify-start"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                size="lg"
                  className="text-base sm:text-sm md:text-base lg:text-lg px-6 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-2.5 md:py-3 group relative overflow-hidden w-full sm:w-auto"
                onClick={() => handleHeroCta(primaryCta)}
              >
                <span className="relative z-10">{primaryCta.label}</span>
                <div className="absolute inset-0 bg-foreground/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" variant="outline" className="text-base sm:text-sm md:text-base lg:text-lg px-6 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-2.5 md:py-3 group relative overflow-hidden w-full sm:w-auto">
              <a
                  href={secondaryCta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 opacity-0 group-hover:opacity-20 group-hover:scale-110 transition-all duration-300 transform origin-center" />
                  <Play className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2 fill-pink-500 text-pink-500 play-icon-glow" />
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
            className="hidden lg:flex flex-col items-end gap-2 md:gap-3 flex-shrink-0"
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
              className="flex flex-col gap-1.5 md:gap-2 text-xs tracking-[0.25em] text-white/70"
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
              className="flex items-center gap-2 hover:text-white transition"
            >
                    <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="whitespace-nowrap">{platform.label}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </motion.div>
        </div>
      </div>
      {selectedVideo && (
        <YouTubePlayer
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
    </>
  );
};

export default Hero;
