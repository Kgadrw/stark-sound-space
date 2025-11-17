const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const adminRouter = require("./routes/admin");
const authRouter = require("./routes/auth");
const youtubeRouter = require("./routes/youtube");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// Function to setup Swagger with dynamic server URL
const swaggerSetup = (req, res, next) => {
  // Get protocol and host from request (works with proxy)
  const protocol = req.protocol || (req.secure ? "https" : "http");
  const host = req.get("host") || "localhost:4000";
  const baseUrl = `${protocol}://${host}`;
  
  const swaggerConfig = {
    ...swaggerDocument,
    servers: [
      { url: `${baseUrl}/api`, description: "Current server" },
      { url: "http://localhost:4000/api", description: "Local development" },
    ],
  };
  
  return swaggerUi.setup(swaggerConfig)(req, res, next);
};

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB || "stark-sound-space";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Trust proxy for correct protocol detection (needed for Render, Heroku, etc.)
app.set("trust proxy", true);

app.use("/admin", express.static(path.join(__dirname, "..", "public", "admin")));

app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/youtube", youtubeRouter);
app.use("/api/docs", swaggerUi.serve, swaggerSetup);

app.get("/", (_req, res) => {
  res.json({
    message: "Nel Ngabo Backend API",
    version: "1.0.0",
    endpoints: {
      docs: "/api/docs",
      health: "/health",
      admin: "/api/admin",
      auth: "/api/auth",
    },
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.originalUrl });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("Missing MONGO_URI in environment");
    }

    await mongoose.connect(MONGO_URI, { dbName: MONGO_DB });
    console.log(`Connected to MongoDB cluster (${MONGO_DB})`);

    app.listen(PORT, () => {
      console.log(`Backend server listening on http://localhost:${PORT}`);
      console.log(`Admin dashboard available at http://localhost:${PORT}/admin`);
      console.log(`API Documentation (Swagger) available at http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

