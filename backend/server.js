require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const menuRoutes = require("./backend/routes/menu");
const uploadQRRoute = require("./backend/routes/uploadQR"); // ✅ Add QR route

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // ✅ serve uploaded images

// ✅ Existing routes
app.use("/api/menu", menuRoutes);

// ✅ New QR Upload route
app.use("/api", uploadQRRoute);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
