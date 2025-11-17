import { createId } from "@/lib/id";
import { ContentState } from "@/types/content";

export const initialContent: ContentState = {
  hero: {
    artistName: "NEL NGABO",
    backgroundImage: "/hero.jpeg",
    backgroundVideoUrl: "https://youtu.be/lBnokNKI38I",
    navLinks: [
      { id: createId("nav"), label: "MUSIC", targetType: "scroll", targetValue: "music" },
      { id: createId("nav"), label: "ABOUT", targetType: "route", targetValue: "/about" },
      { id: createId("nav"), label: "TOURS", targetType: "scroll", targetValue: "tours" },
    ],
    primaryCta: {
      label: "LATEST ALBUM",
      targetType: "scroll",
      targetValue: "music",
    },
    secondaryCta: {
      label: "WATCH NOW",
      url: "https://www.youtube.com/@nelngabo9740",
    },
    streamingPlatforms: [
      { id: createId("stream"), label: "Spotify", url: "https://open.spotify.com/artist/nelngabo", preset: "spotify" },
      { id: createId("stream"), label: "Apple Music", url: "https://music.apple.com/", preset: "appleMusic" },
      { id: createId("stream"), label: "YouTube", url: "https://www.youtube.com/@nelngabo9740", preset: "youtube" },
      { id: createId("stream"), label: "SoundCloud", url: "https://soundcloud.com/", preset: "soundcloud" },
      { id: createId("stream"), label: "TikTok", url: "https://www.tiktok.com/@nelngabo", preset: "tiktok" },
      { id: createId("stream"), label: "Instagram", url: "https://www.instagram.com/nelngabo", preset: "instagram" },
      { id: createId("stream"), label: "X", url: "https://twitter.com/nelngabo", preset: "x" },
      { id: createId("stream"), label: "Facebook", url: "https://www.facebook.com/nelngabo", preset: "facebook" },
      { id: createId("stream"), label: "Email", url: "mailto:contact@nelngabo.com", preset: "mail" },
      { id: createId("stream"), label: "Phone", url: "tel:+250788123456", preset: "phone" },
    ],
    socialLinks: [],
    latestAlbumName: "VIBRANIUM",
    latestAlbumLink: "/music",
    notificationText: "",
    notificationLink: "",
    notificationLinkText: "Learn More",
    isNotificationVisible: false,
  },
  albums: [
    {
      id: createId("album"),
      title: "LATEST ALBUM",
      year: "2024",
      image: "/Album.jpeg",
      summary: "An explosive fusion of afro-futuristic rhythms with neon synth atmospheres.",
      tracks: ["Intro", "Heartbeat", "Midnight Drive", "Echoes", "Finale"],
      links: [
        { id: createId("link"), label: "Spotify", url: "https://open.spotify.com/artist/nelngabo", description: "Stream in high quality" },
        { id: createId("link"), label: "Apple Music", url: "https://music.apple.com/", description: "Listen on all Apple devices" },
      ],
    },
    {
      id: createId("album"),
      title: "SECOND ALBUM",
      year: "2023",
      image: "/Album.jpeg",
      summary: "A cinematic journey that celebrates coastal sunsets and pulsating nightlife.",
      tracks: ["Start", "Waves", "Hold On", "Skyline"],
      links: [
        { id: createId("link"), label: "Spotify", url: "https://open.spotify.com/artist/nelngabo", description: "Stream in high quality" },
      ],
    },
  ],
  videos: [
    { id: createId("video"), title: "LATEST MUSIC VIDEO", views: "2.5M", videoId: "lBnokNKI38I", description: "Latest release with futuristic visuals." },
    { id: createId("video"), title: "BEHIND THE SCENES", views: "1.8M", videoId: "OpKFRBu3Czk", description: "Studio life and creative process." },
    { id: createId("video"), title: "LIVE PERFORMANCE", views: "3.2M", videoId: "Yx-xJyPORGo", description: "Captured on tour with full band." },
  ],
  tours: [
    { id: createId("tour"), date: "2025-02-15", city: "KIGALI", venue: "BK Arena", ticketUrl: "https://tickets.nelngabo.com/kigali" },
    { id: createId("tour"), date: "2025-03-12", city: "NAIROBI", venue: "KICC", ticketUrl: "https://tickets.nelngabo.com/nairobi" },
  ],
  about: {
    id: createId("about"),
    biography: "",
    careerHighlights: [],
    achievements: [],
    awards: [],
    musicLabel: "",
    location: "",
    email: "",
    phone: "",
    artistImage: "",
  },
};


