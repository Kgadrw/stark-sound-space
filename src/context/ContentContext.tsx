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
      const [heroResponse, albumsResponse, videosResponse, toursResponse, aboutResponse] = await Promise.all([
        adminApi.getHero(),
        adminApi.getAlbums(),
        adminApi.getVideos(),
        adminApi.getTours(),
        adminApi.getAbout(),
      ]);
      setContent((prev) => ({
        ...prev,
        hero: {
          artistName: heroResponse.artistName ?? prev.hero.artistName,
          backgroundImage: heroResponse.imageUrl ?? prev.hero.backgroundImage,
          backgroundVideoUrl: heroResponse.videoUrl ?? prev.hero.backgroundVideoUrl ?? "",
          navLinks: heroResponse.navLinks ?? prev.hero.navLinks,
          primaryCta: heroResponse.primaryCta ?? prev.hero.primaryCta,
          secondaryCta: heroResponse.secondaryCta ?? prev.hero.secondaryCta,
          streamingPlatforms: heroResponse.streamingPlatforms ?? prev.hero.streamingPlatforms,
          socialLinks: heroResponse.socialLinks ?? prev.hero.socialLinks,
        },
        albums: (albumsResponse.albums ?? []).map(mapAlbum),
        videos: (videosResponse.videos ?? []).map(mapVideo),
        tours: (toursResponse.tours ?? []).map(mapTour),
        about: aboutResponse.about ? mapAbout(aboutResponse.about) : prev.about,
      }));
      setError(null);
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

