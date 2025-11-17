const { Router } = require("express");
const {
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
} = require("../controllers/adminController");

const router = Router();

router.get("/hero", getHeroImage);
router.post("/hero", saveHeroImage);

router.get("/albums", listAlbums);
router.post("/albums", createAlbum);
router.put("/albums/:id", updateAlbumHandler);
router.delete("/albums/:id", deleteAlbumHandler);

router.get("/videos", listVideos);
router.post("/videos", createVideo);
router.put("/videos/:id", updateVideoHandler);
router.delete("/videos/:id", deleteVideoHandler);

router.get("/tours", listTours);
router.post("/tours", createTourHandler);
router.put("/tours/:id", updateTourHandler);
router.delete("/tours/:id", deleteTourHandler);

router.get("/about", getAbout);
router.put("/about", updateAbout);

router.get("/uploads/signature", getCloudinarySignature);

module.exports = router;

