const mongoose = require("mongoose");

const heroSettingSchema = new mongoose.Schema(
  {
    artistName: {
      type: String,
      default: "NEL NGABO",
    },
    backgroundImage: {
      type: String,
      required: true,
      default: "/hero.jpeg",
    },
    backgroundVideoUrl: {
      type: String,
      default: "",
    },
    navLinks: [
      {
        id: { type: String, required: true },
        label: { type: String, default: "" },
        targetType: { type: String, enum: ["scroll", "route", "external"], default: "scroll" },
        targetValue: { type: String, default: "" },
      },
    ],
    primaryCta: {
      label: { type: String, default: "" },
      targetType: { type: String, enum: ["scroll", "route", "external", "externalBlank"], default: "scroll" },
      targetValue: { type: String, default: "" },
    },
    secondaryCta: {
      label: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    streamingPlatforms: [
      {
        id: { type: String, required: true },
        label: { type: String, default: "" },
        url: { type: String, default: "" },
        preset: {
          type: String,
          enum: ["spotify", "appleMusic", "youtube", "soundcloud", "boomplay", "tiktok", "instagram", "x", "facebook", "mail", "phone", "website"],
          default: "website",
        },
      },
    ],
    socialLinks: [
      {
        id: { type: String, required: true },
        url: { type: String, default: "" },
      },
    ],
    latestAlbumName: {
      type: String,
      default: "VIBRANIUM",
    },
    latestAlbumLink: {
      type: String,
      default: "/music",
    },
    notificationText: {
      type: String,
      default: "",
    },
    notificationLink: {
      type: String,
      default: "",
    },
    notificationLinkText: {
      type: String,
      default: "Learn More",
    },
    isNotificationVisible: {
      type: Boolean,
      default: false,
    },
    colorSettings: {
      colorType: {
        type: String,
        enum: ["solid", "gradient"],
        default: "solid",
      },
      solidColor: {
        type: String,
        default: "#000000", // Black default
      },
      gradientColors: {
        startColor: {
          type: String,
          default: "#000000",
        },
        endColor: {
          type: String,
          default: "#000000",
        },
        direction: {
          type: String,
          enum: ["to right", "to bottom", "to left", "to top", "to bottom right", "to bottom left", "to top right", "to top left"],
          default: "to bottom",
        },
      },
      titleTextColor: {
        type: String,
        default: "#ffffff", // White default
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("HeroSetting", heroSettingSchema);

