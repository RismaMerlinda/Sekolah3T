require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboard.routes');
const proxyRoutes = require('./routes/proxy.routes');
const proposalRoutes = require('./routes/proposalRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const reportRoutes = require('./routes/reportRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const donorRoutes = require('./routes/donor.routes');

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Main Connection and Server Start
const MONGODB_URL = process.env.MONGODB_URL || process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

console.log("[1] Starting server...");

mongoose
  .connect(MONGODB_URL, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("[2] ✓ MongoDB connected");

    // Load routes
    app.use('/api/auth', authRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/proxy', proxyRoutes);
    app.use('/api/proposals', proposalRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/api/reports', reportRoutes);
    app.use('/api/schools', schoolRoutes);
    app.use("/api/donor", donorRoutes);

    console.log("[3] ✓ All routes loaded");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[4] ✓ Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("[ERROR] MongoDB:", err.message);
  });

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

process.on("unhandledRejection", (err) => {
  console.error("[REJECT]", err.message);
});

process.on("uncaughtException", (err) => {
  console.error("[EXCEPTION]", err.message);
});
