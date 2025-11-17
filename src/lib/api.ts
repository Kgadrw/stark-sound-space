const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://nel-backend-ymxe.onrender.com/api";

type RequestOptions = RequestInit & { json?: unknown };

const request = async <TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> => {
  const { json, headers, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : options.body,
    ...rest,
  });

  if (!response.ok) {
    const message = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(message.message ?? message.error ?? "Request failed");
  }

  return response.json();
};

export const adminApi = {
  getHero: () => request<{ 
    artistName?: string;
    imageUrl: string; 
    videoUrl?: string; 
    navLinks?: any[];
    primaryCta?: any;
    secondaryCta?: any;
    streamingPlatforms?: any[];
    socialLinks?: any[];
    updatedAt: string 
  }>("/admin/hero"),
  updateHero: (payload: { 
    imageUrl?: string; 
    videoUrl?: string;
    artistName?: string;
    navLinks?: any[];
    primaryCta?: any;
    secondaryCta?: any;
    streamingPlatforms?: any[];
    socialLinks?: any[];
    latestAlbumName?: string;
    latestAlbumLink?: string;
    notificationText?: string;
    notificationLink?: string;
    notificationLinkText?: string;
    isNotificationVisible?: boolean;
  }) =>
    request<{ 
      artistName?: string;
      imageUrl: string; 
      videoUrl?: string; 
      navLinks?: any[];
      primaryCta?: any;
      secondaryCta?: any;
      streamingPlatforms?: any[];
      socialLinks?: any[];
      updatedAt: string 
    }>("/admin/hero", {
      method: "POST",
      json: payload,
    }),
  login: (payload: { username: string; password: string }) =>
    request<{ success: boolean; username: string }>("/auth/login", {
      method: "POST",
      json: payload,
    }),
  updateCredentials: (payload: { currentPassword: string; username?: string; password?: string }) =>
    request<{ success: boolean; username: string }>("/auth/credentials", {
      method: "PUT",
      json: payload,
    }),
  getAlbums: () => request<{ albums: any[] }>("/admin/albums"),
  createAlbum: (payload: {
    title: string;
    year?: string;
    coverUrl: string;
    summary?: string;
    description?: string;
    tracks?: string[];
    links?: any[];
  }) =>
    request("/admin/albums", {
      method: "POST",
      json: payload,
    }),
  updateAlbum: (id: string, payload: {
    title?: string;
    year?: string;
    coverUrl?: string;
    summary?: string;
    description?: string;
    tracks?: string[];
    links?: any[];
  }) =>
    request(`/admin/albums/${id}`, {
      method: "PUT",
      json: payload,
    }),
  deleteAlbum: (id: string) =>
    request(`/admin/albums/${id}`, {
      method: "DELETE",
    }),
  getVideos: () => request<{ videos: any[] }>("/admin/videos"),
  createVideo: (payload: { title: string; youtubeUrl: string; views?: string; description?: string }) =>
    request("/admin/videos", {
      method: "POST",
      json: payload,
    }),
  updateVideo: (id: string, payload: { title?: string; youtubeUrl?: string; views?: string; description?: string }) =>
    request(`/admin/videos/${id}`, {
      method: "PUT",
      json: payload,
    }),
  deleteVideo: (id: string) =>
    request(`/admin/videos/${id}`, {
      method: "DELETE",
    }),
  getTours: () => request<{ tours: any[] }>("/admin/tours"),
  createTour: (payload: { date: string; city: string; venue: string; ticketUrl: string }) =>
    request("/admin/tours", {
      method: "POST",
      json: payload,
    }),
  updateTour: (id: string, payload: { date?: string; city?: string; venue?: string; ticketUrl?: string }) =>
    request(`/admin/tours/${id}`, {
      method: "PUT",
      json: payload,
    }),
  deleteTour: (id: string) =>
    request(`/admin/tours/${id}`, {
      method: "DELETE",
    }),
  getAbout: () => request<{ about: any }>("/admin/about"),
  updateAbout: (payload: {
    biography?: string;
    careerHighlights?: Array<{ title: string; description: string }>;
    achievements?: Array<{ year: string; title: string; organization: string }>;
    awards?: Array<{ title: string; description: string }>;
    musicLabel?: string;
    location?: string;
    email?: string;
    phone?: string;
    artistImage?: string;
  }) =>
    request("/admin/about", {
      method: "PUT",
      json: payload,
    }),
  searchYouTube: (query: string) =>
    request<{ videos: Array<{
      id: string;
      title: string;
      description: string;
      thumbnail: string;
      channelTitle: string;
      publishedAt: string;
    }> }>(`/youtube/search?q=${encodeURIComponent(query)}`),
};


