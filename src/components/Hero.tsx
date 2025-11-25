import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { Play, Pause, Music3, Music4, Disc3, Youtube, Radio, Search, Phone, Mail, Instagram, Twitter, Music2, Facebook, Globe, Volume2, VolumeX } from "lucide-react";
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
  routeUrl?: string; // For routing to specific pages like /video/:id, /album/:id
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

const iconMap: Record<IconPreset, LucideIcon> = {
  spotify: Music4,
  appleMusic: Disc3,
  youtube: Youtube,
  soundcloud: Radio,
  boomplay: Music3,
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
  if (lowerUrl.includes("boomplay")) return "boomplay";
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
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showVideoControls, setShowVideoControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
    targetType: "route",
    targetValue: "/music",
  };
  const secondaryCta = {
    label: "Watch Now",
    url: "https://www.youtube.com/@nelngabo9740",
  };

  // Only show these streaming platforms: Spotify, Apple Music, YouTube, SoundCloud, Boomplay
  const allowedStreamingPresets: IconPreset[] = ["spotify", "appleMusic", "youtube", "soundcloud", "boomplay"];
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
        keywords: ["about", "artist", "biography", ...content.about.careerHighlights.flatMap(ch => [ch.title, ch.description].filter(Boolean))],
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
      ...BASE_SEARCH_ITEMS.map(project), 
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
        // Don't log sensitive error details
        if (process.env.NODE_ENV === 'development') {
          console.error("YouTube search error");
        }
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
    if (item.routeUrl) {
      navigate(item.routeUrl);
      setSearchQuery("");
      setIsSearchOpen(false);
      return;
    }
    if (item.targetId) {
      // Check if targetId is a route (starts with /)
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

  // Attempt to ensure video autoplay on mobile after iframe loads and set HD quality
  const handleVideoIframeLoad = () => {
    if (videoIframeRef.current?.contentWindow && heroVideoUrl) {
      // Multiple attempts to ensure autoplay works on mobile and set HD quality
      const attemptPlay = (delay: number) => {
        setTimeout(() => {
          try {
            // Set HD quality - use 'highres' for highest available quality, 'hd1080' as fallback
            videoIframeRef.current?.contentWindow?.postMessage(
              JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['highres'] }),
              '*'
            );
            // Fallback to hd1080 if highres is not available
            setTimeout(() => {
              videoIframeRef.current?.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['hd1080'] }),
                '*'
              );
            }, 100);
            // Try to trigger play via YouTube iframe API
            videoIframeRef.current?.contentWindow?.postMessage(
              JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
              '*'
            );
          } catch (e) {
            // Silent fail
          }
        }, delay);
      };
      
      // Try multiple times with increasing delays for better mobile compatibility
      attemptPlay(500);
      attemptPlay(1000);
      attemptPlay(2000);
      attemptPlay(3000);
    }
  };

  // Handle user interaction to trigger autoplay on mobile and set HD quality
  useEffect(() => {
    if (!heroVideoUrl) return;

    const handleUserInteraction = () => {
      if (videoIframeRef.current?.contentWindow) {
        try {
          // Set HD quality - use 'highres' for highest available quality
          videoIframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['highres'] }),
            '*'
          );
          // Fallback to hd1080
          setTimeout(() => {
            videoIframeRef.current?.contentWindow?.postMessage(
              JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['hd1080'] }),
              '*'
            );
          }, 100);
          // Play video
          videoIframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
            '*'
          );
        } catch (e) {
          // Silent fail
        }
      }
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    // Add listeners for user interaction (required for mobile autoplay)
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('click', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [heroVideoUrl]);

  // Additional effect to continuously ensure HD quality is set
  useEffect(() => {
    if (!heroVideoUrl || !videoIframeRef.current?.contentWindow) return;

    const interval = setInterval(() => {
      try {
        // Continuously try to set HD quality
        videoIframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['highres'] }),
          '*'
        );
      } catch (e) {
        // Silent fail
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [heroVideoUrl]);

  // Auto-hide video controls after 3 seconds
  useEffect(() => {
    if (!heroVideoUrl) return;

    const hideControls = () => {
      setShowVideoControls(false);
    };

    const showControls = () => {
      setShowVideoControls(true);
      // Clear existing timeout
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      // Hide again after 3 seconds
      controlsTimeoutRef.current = setTimeout(hideControls, 3000);
    };

    // Initial timeout to hide after 3 seconds
    controlsTimeoutRef.current = setTimeout(hideControls, 3000);

    // Show controls on mouse move in hero section
    const handleMouseMove = () => {
      showControls();
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [heroVideoUrl]);

  // Toggle mute/unmute for hero video
  const toggleMute = () => {
    if (videoIframeRef.current?.contentWindow && heroVideoUrl) {
      try {
        const newMutedState = !isMuted;
        videoIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ 
            event: 'command', 
            func: newMutedState ? 'mute' : 'unMute', 
            args: '' 
          }),
          '*'
        );
        // Ensure HD quality is maintained
        videoIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['highres'] }),
          '*'
        );
        setIsMuted(newMutedState);
      } catch (e) {
        // Silent fail
      }
    }
  };

  // Toggle play/pause for hero video
  const togglePlayPause = () => {
    if (videoIframeRef.current?.contentWindow && heroVideoUrl) {
      try {
        const newPlayingState = !isPlaying;
        videoIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ 
            event: 'command', 
            func: newPlayingState ? 'playVideo' : 'pauseVideo', 
            args: '' 
          }),
          '*'
        );
        // Ensure HD quality is maintained
        videoIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setPlaybackQuality', args: ['highres'] }),
          '*'
        );
        setIsPlaying(newPlayingState);
      } catch (e) {
        // Silent fail
      }
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
    <section className="relative h-[50vh] lg:h-screen w-full overflow-hidden border-0 bg-black/[0.3]">
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
            playsInline={true}
            {...({ 'webkit-playsinline': 'true' } as any)}
            loading="eager"
            onLoad={handleVideoIframeLoad}
            style={{ pointerEvents: "none" }}
            title="Background Video"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/0 to-transparent z-0 pointer-events-none" />
      </div>
      <div className="relative z-20 h-full flex flex-col justify-end pb-12 lg:pb-16 px-4 sm:px-6">
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
            className="text-xs uppercase tracking-[0.5em] text-white/50"
          >
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
                const isSpotify = platform.preset === "spotify";
                const isAppleMusic = platform.preset === "appleMusic";
                const isYouTube = platform.preset === "youtube";
                const isBoomplay = platform.preset === "boomplay";
                
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
                    {isSpotify ? (
                      <svg className="h-3.5 w-3.5 md:h-4 md:w-4" viewBox="0 0 24 24" fill="#1DB954">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                    ) : isAppleMusic ? (
                      <svg className="h-3.5 w-3.5 md:h-4 md:w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                      </svg>
                    ) : isYouTube ? (
                      <svg className="h-3.5 w-3.5 md:h-4 md:w-4" viewBox="0 0 24 24" fill="#FF0000">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    ) : isBoomplay ? (
                      <img src="/Boom.png" alt="Boomplay" className="h-3.5 w-3.5 md:h-4 md:w-4 object-contain" />
                    ) : (
                      <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    )}
                    <span className="whitespace-nowrap">{platform.label}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </motion.div>
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