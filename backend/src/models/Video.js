const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    videoId: { type: String, required: true },
    views: { type: String, default: "0" },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Video", videoSchema);

