export type HeroNavLink = {
  id: string;
  label: string;
  targetType: "scroll" | "route" | "external";
  targetValue: string;
};

export type HeroCta = {
  label: string;
  targetType: "scroll" | "route" | "external" | "externalBlank";
  targetValue: string;
};

export type HeroSecondaryCta = {
  label: string;
  url: string;
};

export type IconPreset =
  | "spotify"
  | "appleMusic"
  | "youtube"
  | "soundcloud"
  | "tiktok"
  | "instagram"
  | "x"
  | "facebook"
  | "mail"
  | "phone"
  | "website";

export type StreamingPlatform = {
  id: string;
  label: string;
  url: string;
  preset: IconPreset;
};

export type SocialLink = {
  id: string;
  url: string;
};

export type ContactMethod = {
  id: string;
  label: string;
  value: string;
  href: string;
  preset: IconPreset;
};

export type HeroContent = {
  artistName: string;
  backgroundImage: string; // Fallback image
  backgroundVideoUrl: string; // YouTube video URL for background
  navLinks: HeroNavLink[];
  primaryCta: HeroCta;
  secondaryCta: HeroSecondaryCta;
  streamingPlatforms: StreamingPlatform[];
  socialLinks: SocialLink[];
};

export type AlbumLink = {
  id: string;
  label: string;
  url: string;
  description: string;
};

export type Album = {
  id: string;
  title: string;
  year: string;
  image: string;
  summary: string;
  description: string;
  tracks: string[];
  links: AlbumLink[];
};

export type Video = {
  id: string;
  title: string;
  views: string;
  videoId: string;
  description: string;
};

export type Tour = {
  id: string;
  date: string;
  city: string;
  venue: string;
  ticketUrl: string;
};

export type CareerHighlight = {
  title: string;
  description: string;
};

export type Achievement = {
  year: string;
  title: string;
  organization: string;
};

export type Award = {
  title: string;
  description: string;
};

export type AboutContent = {
  id: string;
  biography: string;
  careerHighlights: CareerHighlight[];
  achievements: Achievement[];
  awards: Award[];
  musicLabel: string;
  location: string;
  email: string;
  phone: string;
  artistImage: string;
};

export type ContentState = {
  hero: HeroContent;
  albums: Album[];
  videos: Video[];
  tours: Tour[];
  about: AboutContent;
};


