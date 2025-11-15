const mongoose = require("mongoose");

const heroSettingSchema = new mongoose.Schema(
  {
    backgroundImage: {
      type: String,
      required: true,
      default: "/hero.jpeg",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("HeroSetting", heroSettingSchema);

