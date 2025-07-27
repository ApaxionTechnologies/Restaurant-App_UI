


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



import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import restaurantRoutes from "./routes/restaurant.js"; // Import the restaurant routes

dotenv.config(); // Load environment variables

const app = express();

// ✅ Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON request bodies

// ✅ Routes
app.use("/api/restaurants", restaurantRoutes); // Routes related to restaurants

// ✅ MongoDB Connection
const PORT = process.env.PORT || 5000; // Port from environment or default to 5000
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/qr_menu"; // Mongo URI from environment or default to local MongoDB

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); // Start server if DB connection is successful
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err)); // Handle DB connection errors
