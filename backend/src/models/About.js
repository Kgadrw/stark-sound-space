const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    biography: {
      type: String,
      default: "",
    },
    careerHighlights: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    achievements: [
      {
        year: { type: String, default: "" },
        title: { type: String, default: "" },
        organization: { type: String, default: "" },
      },
    ],
    awards: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    musicLabel: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    artistImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("About", aboutSchema);

