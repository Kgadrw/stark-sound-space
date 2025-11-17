const HeroSetting = require("../models/HeroSetting");
const Album = require("../models/Album");
const Video = require("../models/Video");
const Tour = require("../models/Tour");
const About = require("../models/About");
const { getUploadSignature } = require("../services/cloudinary");

const normalizeTracks = (tracks) => {
  if (Array.isArray(tracks)) {
    return tracks.filter(Boolean).map((track) => track.trim());
  }
  if (typeof tracks === "string") {
    return tracks
      .split(/\r?\n/)
      .map((track) => track.trim())
      .filter(Boolean);
  }
  return [];
};

const extractVideoId = (url) => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
};

const ensureHeroSetting = async () => {
  let hero = await HeroSetting.findOne();
  if (!hero) {
    hero = await HeroSetting.create({ backgroundImage: "/hero.jpeg" });
  }
  return hero;
};

const createId = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const formatAlbum = (album) => ({
  id: album.id ?? album._id,
  title: album.title,
  year: album.year,
  coverUrl: album.coverUrl,
  summary: album.summary,
  description: album.description,
  tracks: album.tracks,
  links: album.links,
  createdAt: album.createdAt,
  updatedAt: album.updatedAt,
});

const formatVideo = (video) => ({
  id: video.id ?? video._id,
  title: video.title,
  youtubeUrl: video.youtubeUrl,
  videoId: video.videoId,
  views: video.views,
  description: video.description,
  createdAt: video.createdAt,
  updatedAt: video.updatedAt,
});

const formatTour = (tour) => ({
  id: tour.id ?? tour._id,
  date: tour.date,
  city: tour.city,
  venue: tour.venue,
  ticketUrl: tour.ticketUrl,
  createdAt: tour.createdAt,
  updatedAt: tour.updatedAt,
});

const ensureLinks = (links = []) =>
  links.map((link) => ({
    id: link.id ?? createId("link"),
    label: link.label,
    url: link.url,
    description: link.description ?? "",
  }));

const formatHero = (hero) => ({
  artistName: hero.artistName || "NEL NGABO",
  imageUrl: hero.backgroundImage,
  videoUrl: hero.backgroundVideoUrl || "",
  navLinks: hero.navLinks || [],
  primaryCta: hero.primaryCta || { label: "", targetType: "scroll", targetValue: "" },
  secondaryCta: hero.secondaryCta || { label: "", url: "" },
  streamingPlatforms: hero.streamingPlatforms || [],
  socialLinks: hero.socialLinks || [],
  updatedAt: hero.updatedAt,
});

const getHeroImage = async (_req, res, next) => {
  try {
    const hero = await ensureHeroSetting();
    res.json(formatHero(hero));
  } catch (error) {
    next(error);
  }
};

const saveHeroImage = async (req, res, next) => {
  try {
    const { 
      imageUrl, 
      videoUrl, 
      artistName, 
      navLinks, 
      primaryCta, 
      secondaryCta, 
      streamingPlatforms, 
      socialLinks 
    } = req.body;
    const hero = await ensureHeroSetting();
    
    if (imageUrl !== undefined) {
      hero.backgroundImage = imageUrl || "/hero.jpeg";
    }
    if (videoUrl !== undefined) {
      hero.backgroundVideoUrl = videoUrl || "";
    }
    if (artistName !== undefined) {
      hero.artistName = artistName || "NEL NGABO";
    }
    if (navLinks !== undefined) {
      hero.navLinks = Array.isArray(navLinks) ? navLinks : [];
    }
    if (primaryCta !== undefined) {
      hero.primaryCta = primaryCta || { label: "", targetType: "scroll", targetValue: "" };
    }
    if (secondaryCta !== undefined) {
      hero.secondaryCta = secondaryCta || { label: "", url: "" };
    }
    if (streamingPlatforms !== undefined) {
      hero.streamingPlatforms = Array.isArray(streamingPlatforms) ? streamingPlatforms : [];
    }
    if (socialLinks !== undefined) {
      hero.socialLinks = Array.isArray(socialLinks) ? socialLinks : [];
    }
    
    await hero.save();
    res.json(formatHero(hero));
  } catch (error) {
    console.error("Error saving hero:", error);
    next(error);
  }
};

const listAlbums = async (_req, res, next) => {
  try {
    const data = await Album.find().sort({ createdAt: -1 });
    res.json({ albums: data.map(formatAlbum) });
  } catch (error) {
    next(error);
  }
};

const createAlbum = async (req, res, next) => {
  try {
    const { title, year, coverUrl, tracks, summary, description, links } = req.body;
    if (!title || !coverUrl) {
      return res.status(400).json({ message: "title and coverUrl are required" });
    }
    const album = await Album.create({
      title,
      year: year || "",
      coverUrl,
      summary: summary ?? "",
      description: description ?? "",
      tracks: normalizeTracks(tracks),
      links: ensureLinks(Array.isArray(links) ? links : []),
    });
    res.status(201).json(formatAlbum(album));
  } catch (error) {
    next(error);
  }
};

const updateAlbumHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, year, coverUrl, tracks, summary, description, links } = req.body;
    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    // Update fields only if they are provided in the request
    if (title !== undefined) {
      album.title = title || "Untitled";
    }
    if (year !== undefined) {
      album.year = year || "";
    }
    if (coverUrl !== undefined) {
      album.coverUrl = coverUrl || "/Album.jpeg";
    }
    if (summary !== undefined) {
      album.summary = summary || "";
    }
    if (description !== undefined) {
      album.description = description || "";
    }
    if (tracks !== undefined) {
      album.tracks = normalizeTracks(tracks);
    }
    if (links !== undefined) {
      album.links = ensureLinks(Array.isArray(links) ? links : []);
    }
    await album.save();
    res.json(formatAlbum(album));
  } catch (error) {
    console.error("Error updating album:", error);
    next(error);
  }
};

const deleteAlbumHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const album = await Album.findByIdAndDelete(id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }
    res.json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error deleting album:", error);
    next(error);
  }
};

const listVideos = async (_req, res, next) => {
  try {
    const data = await Video.find().sort({ createdAt: -1 });
    res.json({ videos: data.map(formatVideo) });
  } catch (error) {
    next(error);
  }
};

const createVideo = async (req, res, next) => {
  try {
    const { title, youtubeUrl, views, description } = req.body;
    if (!title || !youtubeUrl) {
      return res.status(400).json({ message: "title and youtubeUrl are required" });
    }
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return res.status(400).json({ message: "Unable to extract video id from URL" });
    }
    const video = await Video.create({
      title,
      youtubeUrl,
      videoId,
      views: views ?? "0",
      description: description ?? "",
    });
    res.status(201).json(formatVideo(video));
  } catch (error) {
    next(error);
  }
};

const updateVideoHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, youtubeUrl, views, description } = req.body;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    // Update fields only if they are provided in the request
    if (title !== undefined) {
      video.title = title;
    }
    if (views !== undefined) {
      video.views = views;
    }
    if (description !== undefined) {
      video.description = description;
    }
    if (youtubeUrl !== undefined) {
      const videoId = extractVideoId(youtubeUrl);
      if (!videoId) {
        return res.status(400).json({ message: "Unable to extract video id from URL" });
      }
      video.youtubeUrl = youtubeUrl;
      video.videoId = videoId;
    }
    await video.save();
    res.json(formatVideo(video));
  } catch (error) {
    console.error("Error updating video:", error);
    next(error);
  }
};

const deleteVideoHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    next(error);
  }
};

const listTours = async (_req, res, next) => {
  try {
    const data = await Tour.find().sort({ date: 1 });
    res.json({ tours: data.map(formatTour) });
  } catch (error) {
    next(error);
  }
};

const createTourHandler = async (req, res, next) => {
  try {
    const { date, city, venue, ticketUrl } = req.body;
    if (!date || !city || !venue || !ticketUrl) {
      return res.status(400).json({ message: "date, city, venue and ticketUrl are required" });
    }
    const tour = await Tour.create({ date, city, venue, ticketUrl });
    res.status(201).json(formatTour(tour));
  } catch (error) {
    next(error);
  }
};

const updateTourHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, city, venue, ticketUrl } = req.body;
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    // Update fields only if they are provided in the request
    if (date !== undefined) {
      tour.date = date;
    }
    if (city !== undefined) {
      tour.city = city;
    }
    if (venue !== undefined) {
      tour.venue = venue;
    }
    if (ticketUrl !== undefined) {
      tour.ticketUrl = ticketUrl;
    }
    await tour.save();
    res.json(formatTour(tour));
  } catch (error) {
    console.error("Error updating tour:", error);
    next(error);
  }
};

const deleteTourHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findByIdAndDelete(id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    next(error);
  }
};

const getCloudinarySignature = (_req, res, next) => {
  try {
    const payload = getUploadSignature();
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

const ensureAbout = async () => {
  let about = await About.findOne();
  if (!about) {
    about = await About.create({
      biography: "",
      careerHighlights: [],
      achievements: [],
      awards: [],
      musicLabel: "",
      location: "",
      email: "",
      phone: "",
      artistImage: "",
    });
  }
  return about;
};

const formatAbout = (about) => ({
  id: about.id ?? about._id,
  biography: about.biography,
  careerHighlights: about.careerHighlights,
  achievements: about.achievements,
  awards: about.awards,
  musicLabel: about.musicLabel,
  location: about.location,
  email: about.email,
  phone: about.phone,
  artistImage: about.artistImage,
  createdAt: about.createdAt,
  updatedAt: about.updatedAt,
});

const getAbout = async (_req, res, next) => {
  try {
    const about = await ensureAbout();
    res.json({ about: formatAbout(about) });
  } catch (error) {
    next(error);
  }
};

const updateAbout = async (req, res, next) => {
  try {
    const {
      biography,
      careerHighlights,
      achievements,
      awards,
      musicLabel,
      location,
      email,
      phone,
      artistImage,
    } = req.body;
    const about = await ensureAbout();
    
    if (biography !== undefined) about.biography = biography;
    if (careerHighlights !== undefined) about.careerHighlights = careerHighlights;
    if (achievements !== undefined) about.achievements = achievements;
    if (awards !== undefined) about.awards = awards;
    if (musicLabel !== undefined) about.musicLabel = musicLabel;
    if (location !== undefined) about.location = location;
    if (email !== undefined) about.email = email;
    if (phone !== undefined) about.phone = phone;
    if (artistImage !== undefined) about.artistImage = artistImage;
    
    await about.save();
    res.json(formatAbout(about));
  } catch (error) {
    console.error("Error updating about:", error);
    next(error);
  }
};

module.exports = {
  getHeroImage,
  saveHeroImage,
  listAlbums,
  createAlbum,
  updateAlbumHandler,
  deleteAlbumHandler,
  listVideos,
  createVideo,
  updateVideoHandler,
  deleteVideoHandler,
  listTours,
  createTourHandler,
  updateTourHandler,
  deleteTourHandler,
  getAbout,
  updateAbout,
  getCloudinarySignature,
};

