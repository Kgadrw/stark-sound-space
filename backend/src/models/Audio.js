const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    link: { type: String, required: true },
    title: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Audio", audioSchema);

