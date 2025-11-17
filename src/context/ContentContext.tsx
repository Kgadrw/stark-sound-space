import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initialContent } from "@/lib/contentDefaults";
import { ContentState } from "@/types/content";
import { adminApi } from "@/lib/api";

type ContentContextValue = {
  content: ContentState;
  setContent: React.Dispatch<React.SetStateAction<ContentState>>;
  resetContent: () => void;
  refreshContent: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

const cloneContent = (data: ContentState): ContentState => JSON.parse(JSON.stringify(data));

const createFallbackId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `temp-${Math.random().toString(36).slice(2, 10)}`;
};

const mapAlbum = (album: any) => ({
  id: album.id ?? album._id ?? createFallbackId(),
  title: album.title ?? "Untitled",
  year: album.year ?? "",
  image: album.coverUrl ?? album.image ?? "/Album.jpeg",
  summary: album.summary ?? "New release coming soon.",
  description: album.description ?? "",
  tracks: Array.isArray(album.tracks) ? album.tracks : [],
  links: Array.isArray(album.links) ? album.links : [],
  createdAt: album.createdAt ? (typeof album.createdAt === 'string' ? album.createdAt : album.createdAt.toISOString()) : new Date().toISOString(),
  updatedAt: album.updatedAt ? (typeof album.updatedAt === 'string' ? album.updatedAt : album.updatedAt.toISOString()) : new Date().toISOString(),
});

const mapVideo = (video: any) => ({
  id: video.id ?? video._id ?? createFallbackId(),
  title: video.title ?? "Untitled video",
  views: video.views ?? "0",
  videoId: video.videoId ?? "",
  description: video.description ?? "",
  createdAt: video.createdAt ?? video.updatedAt ?? new Date().toISOString(),
});

const mapTour = (tour: any) => ({
  id: tour.id ?? tour._id ?? createFallbackId(),
  date: tour.date ?? "",
  city: tour.city ?? "",
  venue: tour.venue ?? "",
  ticketUrl: tour.ticketUrl ?? "#",
});

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<ContentState>(() => cloneContent(initialContent));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapAbout = (about: any) => ({
    id: about.id ?? about._id ?? createFallbackId(),
    biography: about.biography ?? "",
    careerHighlights: Array.isArray(about.careerHighlights) ? about.careerHighlights : [],
    achievements: Array.isArray(about.achievements) ? about.achievements : [],
    awards: Array.isArray(about.awards) ? about.awards : [],
    musicLabel: about.musicLabel ?? "",
    location: about.location ?? "",
    email: about.email ?? "",
    phone: about.phone ?? "",
    artistImage: about.artistImage ?? "",
  });

  const refreshContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const [heroResponse, albumsResponse, videosResponse, toursResponse, aboutResponse] = await Promise.allSettled([
        adminApi.getHero(),
        adminApi.getAlbums(),
        adminApi.getVideos(),
        adminApi.getTours(),
        adminApi.getAbout().catch(() => ({ about: null })),
      ]);
      
      const hero = heroResponse.status === "fulfilled" ? heroResponse.value : null;
      const albums = albumsResponse.status === "fulfilled" ? albumsResponse.value : { albums: [] };
      const videos = videosResponse.status === "fulfilled" ? videosResponse.value : { videos: [] };
      const tours = toursResponse.status === "fulfilled" ? toursResponse.value : { tours: [] };
      const about = aboutResponse.status === "fulfilled" ? aboutResponse.value : { about: null };
      
      setContent((prev) => ({
        ...prev,
        hero: hero ? {
          artistName: hero.artistName ?? prev.hero.artistName,
          backgroundImage: hero.imageUrl ?? prev.hero.backgroundImage,
          backgroundVideoUrl: hero.videoUrl ?? prev.hero.backgroundVideoUrl ?? "",
          navLinks: hero.navLinks ?? prev.hero.navLinks,
          primaryCta: hero.primaryCta ?? prev.hero.primaryCta,
          secondaryCta: hero.secondaryCta ?? prev.hero.secondaryCta,
          streamingPlatforms: hero.streamingPlatforms ?? prev.hero.streamingPlatforms,
          socialLinks: hero.socialLinks ?? prev.hero.socialLinks,
          latestAlbumName: hero.latestAlbumName ?? prev.hero.latestAlbumName ?? "VIBRANIUM",
          latestAlbumLink: hero.latestAlbumLink ?? prev.hero.latestAlbumLink ?? "/music",
          notificationText: hero.notificationText ?? prev.hero.notificationText ?? "",
          notificationLink: hero.notificationLink ?? prev.hero.notificationLink ?? "",
          notificationLinkText: hero.notificationLinkText ?? prev.hero.notificationLinkText ?? "Learn More",
          isNotificationVisible: hero.isNotificationVisible ?? prev.hero.isNotificationVisible ?? false,
        } : prev.hero,
        albums: (albums.albums ?? []).map(mapAlbum),
        videos: (videos.videos ?? []).map(mapVideo),
        tours: (tours.tours ?? []).map(mapTour),
        about: about.about ? mapAbout(about.about) : prev.about,
      }));
      
      // Only set error if critical requests failed
      if (heroResponse.status === "rejected" && albumsResponse.status === "rejected") {
        const message = heroResponse.reason instanceof Error ? heroResponse.reason.message : "Failed to load content";
        setError(message);
      } else {
        setError(null);
      }
      
      // Log individual failures without breaking the app
      if (heroResponse.status === "rejected") {
        console.warn("Failed to load hero:", heroResponse.reason);
      }
      if (aboutResponse.status === "rejected") {
        console.warn("Failed to load about (route may not be deployed yet):", aboutResponse.reason);
      }
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : "Failed to load content";
      setError(message);
      console.error(fetchError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      setContent,
      resetContent: () => setContent(cloneContent(initialContent)),
      refreshContent,
      isLoading,
      error,
    }),
    [content, isLoading, error, refreshContent],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return context;
};

