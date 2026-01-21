require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const app = express();

// ✅ CORS (cookie ready)
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ✅ MongoDB
mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/sahabat3t",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// ✅ ROUTES (SEMUA DI SINI)
app.use("/api/v1/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ BARU LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
