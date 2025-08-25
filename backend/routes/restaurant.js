// //23082555
// import express from "express";
// import multer from "multer";
// import {
//   registerRestaurant,
//   loginRestaurant,
//   getRestaurantByEmail,
//   updateTables,
//   deleteRestaurant,
//   updateRestaurant,
// } from "../controllers/restaurantController.js";

// const router = express.Router();

// // ✅ Multer setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = multer({ storage });

// // Routes
// router.post("/register", upload.single("image"), registerRestaurant);
// router.post("/login", loginRestaurant);
// router.get("/:email", getRestaurantByEmail);
// router.put("/:email/tables", updateTables);
// router.put("/:email", upload.single("image"), updateRestaurant);
// router.delete("/:email", deleteRestaurant);

// export default router;
 main_palak



// routes/restaurant.js


import express from "express";
import multer from "multer";
import {
  registerRestaurant,
  loginRestaurant,
  getRestaurantByEmail,
  updateTables,
  deleteRestaurant,
  updateRestaurant,
  getCurrentRestaurant, // ✅ import this
} from "../controllers/restaurantController.js";

import { requireAuth } from "../middleware/auth.js"; // ✅ import auth middleware

const router = express.Router();

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ allow multiple named fields (backward compatible with main "image")
const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },       // existing main image
  { name: "logoImage", maxCount: 1 },   // ✅ new
  { name: "headerImage", maxCount: 1 }, // ✅ new
  { name: "footerImage", maxCount: 1 }, // ✅ new
]);

// Routes
router.post("/register", uploadFields, registerRestaurant);
router.post("/login", loginRestaurant);
router.get("/:email", getRestaurantByEmail);
router.put("/:email/tables", updateTables);
router.put("/:email", uploadFields, updateRestaurant);
router.delete("/:email", deleteRestaurant);

 main_palak

router.get("/me", requireAuth, getCurrentRestaurant); 
router.get("/:email", getRestaurantByEmail);

export default router;

// import express from "express";
// import Restaurant from "../models/Restaurant.js"; // Assuming your Restaurant model is set up correctly

// const router = express.Router();

// // ✅ Register Route (Add restaurant details)
// router.post("/register", async (req, res) => {
//   try {
//     const { restaurantName, firstName, lastName, contact, email, password, tables, address } = req.body;

//     // Check if the restaurant already exists
//     const existingRestaurant = await Restaurant.findOne({ email });
//     if (existingRestaurant) {
//       return res.status(400).json({ error: "Restaurant with this email already exists!" });
//     }

//     const newRestaurant = new Restaurant({
//       restaurantName,
//       firstName,
//       lastName,
//       contact,
//       email,
//       password,  // Storing password as plain text (not hashed)
//       tables, // Accepts the number of tables here
//       address,
//     });

//     await newRestaurant.save();
//     res.status(201).json({ message: "Restaurant registered successfully!" });
//   } catch (err) {
//     console.error("❌ Registration error:", err);
//     res.status(500).json({ error: "Registration failed" });
//   }
// });

// // ✅ Login Route (Authenticate restaurant)
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const restaurant = await Restaurant.findOne({ email });

//     if (!restaurant || restaurant.password !== password) {
//       return res.status(401).json({ error: "Invalid email or password" });
//     }

//     res.status(200).json({
//       message: "Login successful",
//       restaurant: {
//         id: restaurant._id,
//         name: restaurant.restaurantName,
//         email: restaurant.email,
//         tables: restaurant.tables, // Also return tables information
//       },
//     });
//   } catch (err) {
//     console.error("❌ Login error:", err);
//     res.status(500).json({ error: "Login failed" });
//   }
// });

// // ✅ Get Restaurant Data by Email (For Table Management and Validation)
// router.get("/:email", async (req, res) => {
//   const { email } = req.params;

//   try {
//     // Decode the email to handle special characters like '@'
//     const decodedEmail = decodeURIComponent(email);

//     const restaurant = await Restaurant.findOne({ email: decodedEmail });

//     if (!restaurant) {
//       return res.status(404).json({ error: "Restaurant not found" });
//     }

//     // Returning the restaurant data including the number of registered tables
//     res.status(200).json({ restaurant });
//   } catch (err) {
//     console.error("❌ Error fetching restaurant data:", err);
//     res.status(500).json({ error: "Failed to fetch restaurant data" });
//   }
// });

// // ✅ Update Tables for a Restaurant (Update the number of tables if needed)
// router.put("/:email/tables", async (req, res) => {
//   const { email } = req.params;
//   const { tables } = req.body;

//   try {
//     // Decode the email to handle special characters like '@'
//     const decodedEmail = decodeURIComponent(email);

//     // Find the restaurant by email
//     const restaurant = await Restaurant.findOne({ email: decodedEmail });

//     if (!restaurant) {
//       return res.status(404).json({ error: "Restaurant not found" });
//     }

//     // Update the number of tables
//     restaurant.tables = tables;
//     await restaurant.save();

//     res.status(200).json({ message: "Tables updated successfully!" });
//   } catch (err) {
//     console.error("❌ Error updating tables:", err);
//     res.status(500).json({ error: "Failed to update tables" });
//   }
// });

// export default router;

export default router;
 main
