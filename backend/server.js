


// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import restaurantRoutes from "./routes/restaurant.js"; // Import the restaurant routes

// dotenv.config(); // Load environment variables

// const app = express();

// // ✅ Middleware
// app.use(cors()); // Allow cross-origin requests
// app.use(express.json()); // Parse incoming JSON request bodies

// // ✅ Routes
// app.use("/api/restaurants", restaurantRoutes); // Routes related to restaurants

// // ✅ MongoDB Connection
// const PORT = process.env.PORT || 5000; // Port from environment or default to 5000
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/qr_menu"; // Mongo URI from environment or default to local MongoDB

// // Connect to MongoDB
// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB Connected");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); // Start server if DB connection is successful
//   })
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err)); // Handle DB connection errors



// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import restaurantRoutes from "./routes/restaurant.js"; // Import the restaurant routes
// import menuRoutes from './routes/menu.js';

// dotenv.config(); // Load environment variables

// const app = express();

// // ✅ Middleware
// app.use(cors()); // Allow cross-origin requests
// app.use(express.json()); // Parse incoming JSON request bodies
// app.use(express.urlencoded({ extended: true }));

// // ✅ Routes
// app.use("/api/restaurants", restaurantRoutes); // Routes related to restaurants
// app.use('/api/menu', menuRoutes);

// // ✅ MongoDB Connection
// const PORT = process.env.PORT || 5001; // Port from environment or default to 5001
// const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/qr_menu"; // Mongo URI from environment or default to local MongoDB

// // Connect to MongoDB
// mongoose
//   .connect(MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB Connected");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); // Start server if DB connection is successful
//   })
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err)); // Handle DB connection errors



// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import restaurantRoutes from "./routes/restaurant.js";
// import menuRoutes from "./routes/menu.js";


// dotenv.config();

// const app = express();

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Serve uploaded images
// app.use("/uploads", express.static("uploads"));

// // ✅ Routes
// app.use("/api/restaurants", restaurantRoutes);
// app.use("/api/menu", menuRoutes);

// // ✅ MongoDB Connection
// const PORT = process.env.PORT || 5001;
// const MONGO_URI = process.env.MONGO_URI ;
// console.log("MONGO_URI:", process.env.MONGO_URI);

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//   .then(() => {
//     console.log("✅ MongoDB Connected");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import restaurantRoutes from "./routes/restaurant.js";
// import menuRoutes from "./routes/menu.js";


// dotenv.config();

// const app = express();

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Serve uploaded images
// app.use("/uploads", express.static("uploads"));

// // ✅ Routes
// app.use("/api/restaurants", restaurantRoutes);
// app.use("/api/menu", menuRoutes);

// // ✅ MongoDB Connection
// const PORT = process.env.PORT || 5001;
// const MONGO_URI = process.env.MONGO_URI ;
// console.log("MONGO_URI:", process.env.MONGO_URI);

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//   .then(() => {
//     console.log("✅ MongoDB Connected");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((err) => console.error("❌ MongoDB Connection Error:", err));


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from 'url';

import restaurantRoutes from "./routes/restaurant.js";
import menuRoutes from "./routes/menu.js";
import fs from "fs";
// if you made a separate authRoutes file, import that too:
// import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- required env check ----
const requiredEnvs = ["MONGO_URI", "JWT_SECRET", "REFRESH_SECRET", "FRONTEND_URL"];
for (const v of requiredEnvs) {
  if (!process.env[v]) {
    console.warn(`⚠️  Environment variable ${v} is not set`);
  }
}
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");

// ---- app setup ----
const app = express();
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
  next();
}, express.static(path.join(__dirname, 'uploads')));


// Security headers
app.use(helmet());

app.set("trust proxy", 1); 

// Rate limiter (basic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // limit each IP to 120 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS - allow your frontend origin and allow cookies
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true, // <- allows cookies (Set-Cookie) to be sent/received
}));

// parse body + cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// ---- Routes ----
// Note: decide if you want auth endpoints under /api/auth or re-use /api/restaurants
// If your routes file already defines "/register" and "/login", mount appropriately.
app.use("/api/restaurants", restaurantRoutes); // e.g. POST /api/restaurants/register
app.use("/api/menu", menuRoutes);

// If you created authRoutes separately: app.use("/api/auth", authRoutes);

// ---- MongoDB connect + start server ----
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
