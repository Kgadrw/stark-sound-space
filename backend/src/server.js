const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const adminRouter = require("./routes/admin");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB = process.env.MONGO_DB || "stark-sound-space";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/admin", express.static(path.join(__dirname, "..", "public", "admin")));

app.use("/api/admin", adminRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

