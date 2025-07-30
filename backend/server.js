


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


// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import restaurantRoutes from "./routes/restaurant.js";
import menuRoutes from "./routes/menu.js"; // ✅ New


// import path from "path";
// import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve static image uploads
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes); 

// ✅ MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/qr_menu";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
