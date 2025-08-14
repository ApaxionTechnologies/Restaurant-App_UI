


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



// ✅ server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import restaurantRoutes from "./routes/restaurant.js";
import menuRoutes from "./routes/menu.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/menu", menuRoutes);

// ✅ MongoDB Connection
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/qr_menu";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
