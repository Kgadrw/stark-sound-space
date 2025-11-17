const { Router } = require("express");
const { searchYouTube } = require("../controllers/youtubeController");

const router = Router();

router.get("/search", searchYouTube);

module.exports = router;

