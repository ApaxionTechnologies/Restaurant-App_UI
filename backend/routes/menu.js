




// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// // Storage config
// const storage = multer.memoryStorage(); // or diskStorage if you want to store it as file
// const upload = multer({ storage });

// // Route to handle menu item addition
// router.post("/add", upload.single("image"), async (req, res) => {
//   try {
//     const { name, price, timeToPrepare, restaurantEmail } = req.body;
//     const image = req.file; // optional: req.file.buffer if using memoryStorage

//     if (!name || !price || !timeToPrepare || !image || !restaurantEmail) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // You can now save this info to MongoDB
//     // Example:
//     const newItem = {
//       name,
//       price,
//       timeToPrepare,
//       restaurantEmail,
//       image: {
//         data: image.buffer,
//         contentType: image.mimetype,
//       },
//     };

//     // Save to DB (replace this with your model)
//     // await MenuModel.create(newItem);

//     res.status(201).json({ message: "Menu item added", data: newItem });
//   } catch (error) {
//     console.error("❌ Error adding menu item:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;

// routes/menu.js
// import express from "express";
// import multer from "multer";
// import MenuItem from "../models/MenuItem.js"; // Import your menu model

// const router = express.Router();

// // Set up multer for file uploads
// const storage = multer.memoryStorage(); // You can change to diskStorage if you want to save locally
// const upload = multer({ storage });

// // POST /api/menu/add
// router.post("/add", upload.single("image"), async (req, res) => {
//   try {
//     const { name, description, price } = req.body;

//     const newItem = new MenuItem({
//       name,
//       description,
//       price,
//       image: {
//         data: req.file.buffer,
//         contentType: req.file.mimetype,
//       },
//     });

//     await newItem.save();
//     res.status(201).json({ message: "Menu item added successfully" });
//   } catch (err) {
//     console.error("Add menu error:", err);
//     res.status(500).json({ message: "Failed to add menu item", error: err.message });
//   }
// });

// export default router;

// routes/menu.js
import express from "express";
// import multer from "multer";
// import path from "path";
import fs from "fs";
import MenuItem from "../models/MenuItem.js";

const router = express.Router();

// Ensure upload directory exists
// const uploadDir = "uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// Set up multer to store images in /uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// ✅ Add menu item
router.post("/add",  async (req, res) => {      //upload.single("image")
  try {
    const { category, name, price, timeToPrepare, restaurantEmail } = req.body;

    // if (!req.file) {
    //   return res.status(400).json({ message: "Image upload failed" });
    // }

    const newItem = new MenuItem({
      category,
      name,
      price,
      timeToPrepare,
      restaurantEmail,
      // imageUrl: `/${req.file.path}`, // Relative path to serve
    });

    await newItem.save();
    res.status(201).json({ message: "Menu item added successfully" });
  } catch (err) {
    console.error("Add menu error:", err);
    res.status(500).json({ message: "Failed to add menu item", error: err.message });
  }
});

// ✅ Get menu items by restaurantEmail
router.get("/all/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const items = await MenuItem.find({ restaurantEmail: decodeURIComponent(email) });
    res.status(200).json(items);
  } catch (err) {
    console.error("Fetch menu error:", err);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
});

export default router;
