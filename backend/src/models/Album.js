const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    year: { type: String, default: "" },
    coverUrl: { type: String, required: true },
    summary: { type: String, default: "" },
    description: { type: String, default: "" },
    tracks: [{ type: String }],
    links: [
      {
        id: { type: String, required: true },
        label: { type: String, default: "" },
        url: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Album", albumSchema);

