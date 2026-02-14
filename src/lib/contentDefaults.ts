import { createId } from "@/lib/id";
import { ContentState } from "@/types/content";

export const initialContent: ContentState = {
  hero: {
    artistName: "NEL NGABO",
    backgroundImage: "",
    backgroundVideoUrl: "",
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
    streamingPlatforms: [],
    socialLinks: [],
    latestAlbumName: "",
    latestAlbumLink: "/music",
    notificationText: "",
    notificationLink: "",
    notificationLinkText: "Learn More",
    isNotificationVisible: false,
    colorSettings: {
      colorType: "solid",
      solidColor: "#000000",
      gradientColors: {
        startColor: "#000000",
        endColor: "#000000",
        direction: "to bottom",
      },
      titleTextColor: "#ffffff",
    },
  },
  albums: [],
  videos: [],
  tours: [],
  audios: [],
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


