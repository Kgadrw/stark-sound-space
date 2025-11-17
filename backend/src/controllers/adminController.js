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

const formatAlbum = (album) => {
  try {
    let createdAt = new Date().toISOString();
    let updatedAt = new Date().toISOString();
    
    if (album.createdAt) {
      if (album.createdAt instanceof Date) {
        createdAt = album.createdAt.toISOString();
      } else if (typeof album.createdAt === 'string') {
        createdAt = album.createdAt;
      } else if (album.createdAt.toISOString) {
        createdAt = album.createdAt.toISOString();
      }
    }
    
    if (album.updatedAt) {
      if (album.updatedAt instanceof Date) {
        updatedAt = album.updatedAt.toISOString();
      } else if (typeof album.updatedAt === 'string') {
        updatedAt = album.updatedAt;
      } else if (album.updatedAt.toISOString) {
        updatedAt = album.updatedAt.toISOString();
      }
    }
    
    return {
      id: album.id ?? (album._id ? album._id.toString() : null),
      title: album.title || "",
      year: album.year || "",
      coverUrl: album.coverUrl || "/Album.jpeg",
      summary: album.summary || "",
      description: album.description || "",
      tracks: Array.isArray(album.tracks) ? album.tracks : [],
      links: Array.isArray(album.links) ? album.links : [],
      createdAt,
      updatedAt,
    };
  } catch (error) {
    console.error("Error formatting album:", error);
    // Return a safe fallback if formatting fails
    return {
      id: album.id ?? (album._id ? album._id.toString() : null),
      title: album.title || "",
      year: album.year || "",
      coverUrl: album.coverUrl || "/Album.jpeg",
      summary: album.summary || "",
      description: album.description || "",
      tracks: Array.isArray(album.tracks) ? album.tracks : [],
      links: Array.isArray(album.links) ? album.links : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

const formatVideo = (video) => ({
  id: video.id ?? video._id,
  title: video.title,
  youtubeUrl: video.youtubeUrl,
  videoId: video.videoId,
  views: video.views,
  description: video.description,
  lyrics: video.lyrics || "",
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

const ensureLinks = (links = []) => {
  if (!Array.isArray(links)) {
    return [];
  }
  return links
    .filter(link => link && typeof link === 'object')
    .map((link) => ({
      id: link.id && typeof link.id === 'string' ? link.id : createId("link"),
      label: link.label && typeof link.label === 'string' ? link.label : "",
      url: link.url && typeof link.url === 'string' ? link.url : "",
      description: link.description && typeof link.description === 'string' ? link.description : "",
    }));
};

const formatHero = (hero) => ({
  artistName: hero.artistName || "NEL NGABO",
  imageUrl: hero.backgroundImage,
  videoUrl: hero.backgroundVideoUrl || "",
  navLinks: hero.navLinks || [],
  primaryCta: hero.primaryCta || { label: "", targetType: "scroll", targetValue: "" },
  secondaryCta: hero.secondaryCta || { label: "", url: "" },
  streamingPlatforms: hero.streamingPlatforms || [],
  socialLinks: hero.socialLinks || [],
  latestAlbumName: hero.latestAlbumName || "VIBRANIUM",
  latestAlbumLink: hero.latestAlbumLink || "/music",
  notificationText: hero.notificationText || "",
  notificationLink: hero.notificationLink || "",
  notificationLinkText: hero.notificationLinkText || "Learn More",
  isNotificationVisible: hero.isNotificationVisible ?? false,
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
      socialLinks,
      latestAlbumName,
      latestAlbumLink,
      notificationText,
      notificationLink,
      notificationLinkText,
      isNotificationVisible
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
    if (latestAlbumName !== undefined) {
      hero.latestAlbumName = latestAlbumName || "VIBRANIUM";
    }
    if (latestAlbumLink !== undefined) {
      hero.latestAlbumLink = latestAlbumLink || "/music";
    }
    if (notificationText !== undefined) {
      hero.notificationText = notificationText || "";
    }
    if (notificationLink !== undefined) {
      hero.notificationLink = notificationLink || "";
    }
    if (notificationLinkText !== undefined) {
      hero.notificationLinkText = notificationLinkText || "Learn More";
    }
    if (isNotificationVisible !== undefined) {
      hero.isNotificationVisible = isNotificationVisible ?? false;
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
    
    // Validate ID format
    if (!id || id.trim() === "") {
      return res.status(400).json({ message: "Album ID is required" });
    }
    
    // Validate coverUrl size if it's a data URL (base64 image)
    if (coverUrl !== undefined) {
      if (coverUrl && coverUrl.startsWith('data:image')) {
        // Calculate approximate size (base64 is about 33% larger than binary)
        const base64Size = coverUrl.length;
        // Approximate binary size
        const binarySize = Math.floor((base64Size * 3) / 4);
        
        // MongoDB document size limit is 16MB, but we should limit data URLs to a reasonable size
        // Limit to 4MB binary (about 5.3MB base64) to leave room for other fields
        const maxSizeBytes = 4 * 1024 * 1024; // 4MB
        
        if (binarySize > maxSizeBytes) {
          return res.status(400).json({ 
            message: "Image is too large",
            error: `Image size (${(binarySize / 1024 / 1024).toFixed(2)}MB) exceeds the maximum allowed size of ${(maxSizeBytes / 1024 / 1024).toFixed(0)}MB. Please use a smaller image or upload to an image hosting service and use the URL instead.`
          });
        }
        
        // Also check if the entire request body is too large
        const requestSize = JSON.stringify(req.body).length;
        if (requestSize > 10 * 1024 * 1024) { // 10MB JSON limit
          return res.status(400).json({ 
            message: "Request payload too large",
            error: `Request size exceeds the maximum allowed size. Please reduce the image size or use an image URL instead of uploading directly.`
          });
        }
      }
    }
    
    // Try to find album by ID (MongoDB ObjectId or custom ID)
    let album = await Album.findById(id);
    
    // If not found by ObjectId, try finding by a custom id field if it exists
    if (!album) {
      album = await Album.findOne({ id: id });
    }
    
    if (!album) {
      console.error(`Album not found with ID: ${id}`);
      return res.status(404).json({ message: `Album not found with ID: ${id}` });
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
      try {
        album.tracks = normalizeTracks(tracks);
      } catch (tracksError) {
        console.error("Error processing tracks:", tracksError);
        album.tracks = [];
      }
    }
    if (links !== undefined) {
      try {
        console.log("Updating album links:", JSON.stringify(links, null, 2));
        album.links = ensureLinks(Array.isArray(links) ? links : []);
        console.log("Processed album links:", JSON.stringify(album.links, null, 2));
      } catch (linksError) {
        console.error("Error processing links:", linksError);
        console.error("Links error stack:", linksError.stack);
        album.links = [];
      }
    }
    
    // Validate required fields before saving
    if (!album.title || !album.coverUrl) {
      try {
        return res.status(400).json({ 
          message: "Title and coverUrl are required fields",
          album: formatAlbum(album)
        });
      } catch (formatError) {
        console.error("Error formatting album in validation:", formatError);
        return res.status(400).json({ 
          message: "Title and coverUrl are required fields",
          albumId: album._id?.toString() || album.id
        });
      }
    }
    
    try {
      // Check document size before saving (MongoDB limit is 16MB)
      const docSize = JSON.stringify(album.toObject()).length;
      const maxDocSize = 15 * 1024 * 1024; // 15MB to leave some margin
      
      if (docSize > maxDocSize) {
        console.error(`Album document too large: ${(docSize / 1024 / 1024).toFixed(2)}MB`);
        return res.status(400).json({ 
          message: "Album data too large",
          error: `The album data (${(docSize / 1024 / 1024).toFixed(2)}MB) exceeds the maximum allowed size. The image you uploaded is too large. Please use a smaller image (under 2MB) or upload to an image hosting service and use the URL instead.`
        });
      }
      
      await album.save();
      console.log(`Album updated successfully: ${album.id || album._id?.toString() || 'unknown'}`);
      res.json(formatAlbum(album));
    } catch (saveError) {
      console.error("Error saving album to database:", saveError);
      console.error("Save error details:", {
        name: saveError.name,
        message: saveError.message,
        errors: saveError.errors,
        stack: saveError.stack
      });
      
      // Check for MongoDB document size errors
      if (saveError.message && saveError.message.includes('document is too large')) {
        return res.status(400).json({ 
          message: "Image too large for database",
          error: "The image you uploaded is too large to store in the database. Please use a smaller image (under 2MB) or upload to an image hosting service (like Cloudinary, Imgur, or similar) and use the URL instead."
        });
      }
      
      if (saveError.name === "ValidationError") {
        const validationDetails = {};
        if (saveError.errors) {
          Object.keys(saveError.errors).forEach(key => {
            validationDetails[key] = saveError.errors[key].message;
          });
        }
        return res.status(400).json({ 
          message: "Validation error",
          errors: validationDetails
        });
      }
      
      throw saveError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("Error updating album:", error);
    console.error("Error stack:", error.stack);
    console.error("Album ID:", req.params.id);
    console.error("Request body:", JSON.stringify(req.body, null, 2));
    
    // Provide more specific error messages
    if (error.name === "CastError") {
      return res.status(400).json({ 
        message: `Invalid album ID format: ${req.params.id}`,
        error: error.message 
      });
    }
    if (error.name === "ValidationError") {
      const validationErrors = {};
      if (error.errors) {
        Object.keys(error.errors).forEach(key => {
          validationErrors[key] = error.errors[key].message;
        });
      }
      return res.status(400).json({ 
        message: "Validation error",
        errors: validationErrors
      });
    }
    
    // Return a proper error response instead of calling next() to prevent internal server error
    return res.status(500).json({ 
      message: "Internal server error while updating album",
      error: process.env.NODE_ENV === 'development' ? error.message : "An error occurred"
    });
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
    const { title, youtubeUrl, views, description, lyrics } = req.body;
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
      lyrics: lyrics ?? "",
    });
    res.status(201).json(formatVideo(video));
  } catch (error) {
    next(error);
  }
};

const updateVideoHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, youtubeUrl, views, description, lyrics } = req.body;
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
    if (lyrics !== undefined) {
      video.lyrics = lyrics || "";
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

