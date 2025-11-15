const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const hero = {
  imageUrl: "/hero.jpeg",
  updatedAt: new Date().toISOString(),
};

const albums = [
  {
    id: createId("album"),
    title: "LATEST ALBUM",
    year: "2024",
    coverUrl: "/Album.jpeg",
    summary: "An explosive fusion of afro-futuristic rhythms with neon synth atmospheres.",
    tracks: ["Intro", "Vibranium", "Moonlight"],
    links: [
      { id: createId("link"), label: "Spotify", url: "https://open.spotify.com/artist/nelngabo", description: "Stream in high quality" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const videos = [
  {
    id: createId("video"),
    title: "Vibranium (Official Visualizer)",
    youtubeUrl: "https://www.youtube.com/watch?v=lBnokNKI38I",
    videoId: "lBnokNKI38I",
    views: "2.5M",
    description: "Latest release with futuristic visuals.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const tours = [
  {
    id: createId("tour"),
    date: "2025-02-15",
    city: "Kigali",
    venue: "BK Arena",
    ticketUrl: "https://tickets.nelngabo.com/kigali",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const updateHero = ({ imageUrl }) => {
  hero.imageUrl = imageUrl;
  hero.updatedAt = new Date().toISOString();
  return hero;
};

const addAlbum = ({ title, year, coverUrl, tracks, summary = "", links = [] }) => {
  const album = {
    id: createId("album"),
    title,
    year,
    coverUrl,
    summary,
    tracks,
    links,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  albums.unshift(album);
  return album;
};

const updateAlbumById = (id, payload) => {
  const index = albums.findIndex((album) => album.id === id);
  if (index === -1) return null;
  albums[index] = {
    ...albums[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  return albums[index];
};

const deleteAlbumById = (id) => {
  const index = albums.findIndex((album) => album.id === id);
  if (index === -1) return null;
  const [removed] = albums.splice(index, 1);
  return removed;
};

const addVideo = ({ title, youtubeUrl, videoId, views = "0", description = "" }) => {
  const video = {
    id: createId("video"),
    title,
    youtubeUrl,
    videoId,
    views,
    description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  videos.unshift(video);
  return video;
};

const updateVideoById = (id, payload) => {
  const index = videos.findIndex((video) => video.id === id);
  if (index === -1) return null;
  videos[index] = {
    ...videos[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  return videos[index];
};

const deleteVideoById = (id) => {
  const index = videos.findIndex((video) => video.id === id);
  if (index === -1) return null;
  const [removed] = videos.splice(index, 1);
  return removed;
};

const addTour = ({ date, city, venue, ticketUrl }) => {
  const tour = {
    id: createId("tour"),
    date,
    city,
    venue,
    ticketUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tours.unshift(tour);
  return tour;
};

const updateTourById = (id, payload) => {
  const index = tours.findIndex((tour) => tour.id === id);
  if (index === -1) return null;
  tours[index] = {
    ...tours[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  return tours[index];
};

const deleteTourById = (id) => {
  const index = tours.findIndex((tour) => tour.id === id);
  if (index === -1) return null;
  const [removed] = tours.splice(index, 1);
  return removed;
};

module.exports = {
  hero,
  getHero: () => hero,
  updateHero,
  albums,
  addAlbum,
  updateAlbumById,
  deleteAlbumById,
  videos,
  addVideo,
  updateVideoById,
  deleteVideoById,
  tours,
  addTour,
  updateTourById,
  deleteTourById,
};

