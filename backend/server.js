require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

console.log("[1] Starting server...");

// Start listening FIRST
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[2] ✓ Server listening on http://localhost:${PORT}`);
});

// Connect MongoDB AFTER server started
console.log("[3] Connecting to MongoDB:", process.env.MONGODB_URL);

mongoose
  .connect(process.env.MONGODB_URL, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("[4] ✓ MongoDB connected");

    // Load routes AFTER MongoDB connected
    try {
      const donorRoutes = require("./routes/donor.routes");
      app.use("/api/donor", donorRoutes);
      console.log("[5] ✓ Donor routes loaded");
    } catch (err) {
      console.error("[ERROR] Donor routes:", err.message);
    }

    try {
      const authRoutes = require("./routes/authRoutes");
      app.use("/api/auth", authRoutes);
      console.log("[6] ✓ Auth routes loaded");

      const dashboardRoutes = require("./routes/dashboard.routes");
      app.use("/api/dashboard", dashboardRoutes);
      console.log("[7] ✓ Dashboard routes loaded");
    } catch (err) {
      console.error("[ERROR] Auth/Dashboard routes:", err.message);
    }
  })
  .catch((err) => {
    console.error("[ERROR] MongoDB:", err.message);
  });

process.on("unhandledRejection", (err) => {
  console.error("[REJECT]", err.message);
});

process.on("uncaughtException", (err) => {
  console.error("[EXCEPTION]", err.message);
});
