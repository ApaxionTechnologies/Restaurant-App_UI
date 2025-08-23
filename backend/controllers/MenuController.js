
// 🟢 Add Menu Item
// controllers/MenuController.js
import mongoose from "mongoose";

import Restaurant from "../models/Restaurant.js";

export const addMenuItem = async (req, res) => {
  try {
    if (!req.restaurant) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const restaurantId = req.restaurant.id;
    const { name, price, category, queries, timeToPrepare } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Ensure menu array exists
    restaurant.menu = restaurant.menu || [];

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    // Add menu item
    restaurant.menu.push({
      name,
      price,
      category,
      image: imagePath,
      queries,
      prepTime: timeToPrepare,
    });

    await restaurant.save();

    res.status(201).json({ message: "Menu item added successfully", menuItem: restaurant.menu.at(-1) });
  } catch (error) {
    console.error("Error in addMenuItem:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




// Get menu by restaurant id OR name (robust)
export const getMenuByRestaurantId = async (req, res) => {
  const param = req.params.restaurantId; // could be ID
  try {
    let restaurant = null;

    // Agar param valid ObjectId hai
    if (mongoose.Types.ObjectId.isValid(param)) {
      restaurant = await Restaurant.findById(param);
    }

    // Agar ID se nahi mila, optional fallback by name
    if (!restaurant) {
      const decodedName = decodeURIComponent(param);
      restaurant = await Restaurant.findOne({ restaurantName: decodedName });
    }

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menu = Array.isArray(restaurant.menu) ? restaurant.menu : [];

    // Ensure full image URLs
    const hostPrefix = `${req.protocol}://${req.get("host")}`;
    const menuWithFullImage = menu.map((it) => ({
      ...it.toObject?.() ?? it,
      image: it.image && !it.image.startsWith("http") ? `${hostPrefix}${it.image}` : it.image,
    }));

    return res.status(200).json(menuWithFullImage);
  } catch (err) {
    console.error("Error in getMenuByRestaurantId:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};