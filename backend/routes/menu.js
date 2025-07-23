




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
