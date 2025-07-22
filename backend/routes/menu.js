// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const Menu = require('../models/Menu');
// const Restaurant = require('../models/Restaurant');

// // Set up multer for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Store in /uploads folder
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // file-12345.png
//   },
// });

// const upload = multer({ storage });

// // ✅ GET menu items by restaurant email
// router.get('/', async (req, res) => {
//   try {
//     const { email } = req.query;
//     const restaurant = await Restaurant.findOne({ email });
//     if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

//     const menuItems = await Menu.find({ restaurantId: restaurant._id });
//     res.status(200).json(menuItems);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching menu", error });
//   }
// });

// // ✅ POST /api/menu/add — Add menu item with image upload
// router.post('/add', upload.single('image'), async (req, res) => {
//   try {
//     const { name, price, timeToPrepare, restaurantEmail } = req.body;

//     const restaurant = await Restaurant.findOne({ email: restaurantEmail });
//     if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

//     const newItem = new Menu({
//       name,
//       price,
//       timeToPrepare,
//       imageUrl,
//       restaurantId: restaurant._id,
//     });

//     await newItem.save();
//     res.status(201).json({ message: "Menu item added", item: newItem });
//   } catch (error) {
//     console.error("Error adding menu item:", error);
//     res.status(500).json({ message: "Failed to add menu item", error });
//   }
// });

// module.exports = router;






const express = require("express");
const router = express.Router();
const multer = require("multer");

// Storage config
const storage = multer.memoryStorage(); // or diskStorage if you want to store it as file
const upload = multer({ storage });

// Route to handle menu item addition
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, price, timeToPrepare, restaurantEmail } = req.body;
    const image = req.file; // optional: req.file.buffer if using memoryStorage

    if (!name || !price || !timeToPrepare || !image || !restaurantEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // You can now save this info to MongoDB
    // Example:
    const newItem = {
      name,
      price,
      timeToPrepare,
      restaurantEmail,
      image: {
        data: image.buffer,
        contentType: image.mimetype,
      },
    };

    // Save to DB (replace this with your model)
    // await MenuModel.create(newItem);

    res.status(201).json({ message: "Menu item added", data: newItem });
  } catch (error) {
    console.error("❌ Error adding menu item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
