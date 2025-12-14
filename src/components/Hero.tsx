import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play, Pause, Search, Volume2, VolumeX } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import type { HeroCta, HeroNavLink } from "@/types/content";
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
    <section className="relative h-[100vh] w-full overflow-hidden border-0 bg-black/[0.3]">
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