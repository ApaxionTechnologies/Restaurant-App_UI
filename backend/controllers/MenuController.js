
// 🟢 Add Menu Item
export const addMenuItem = async (req, res) => {
  try {
    const { restaurantEmail, name, price, category, queries, timeToPrepare ,
      restaurantId,} = req.body;

    // find restaurant
    const restaurant = await Restaurant.findOne();
    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found" });
    }

    // multer se file ka path aayega
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    // push new menu item
    restaurant.menu.push({
      name,
      price,
      category,
      image: imagePath,
      queries,
      prepTime: timeToPrepare,
     restaurantId,
    }); 

    await restaurant.save();

    console.log("📥 Body:", req.body);
    console.log("📷 File:", req.file);

    res.status(200).json({ message: "Menu item added successfully" });
  } catch (error) {
    console.error("Error in addMenuItem:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Get Menu (no restaurant name needed)
// Get Menu by Restaurant ID
// controllers/MenuController.js
import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";

// Get menu by restaurant id OR name (robust)
export const getMenuByRestaurantId = async (req, res) => {
  const param = req.params.restaurantId; // could be id or name
  try {
    let restaurant = null;

    // 1) If param looks like an ObjectId, try findById
    if (mongoose.Types.ObjectId.isValid(param)) {
      restaurant = await Restaurant.findById(param);
    }

    // 2) If not found by id, try by restaurantName (decode spaces etc.)
    if (!restaurant) {
      const decodedName = decodeURIComponent(param);
      restaurant = await Restaurant.findOne({ restaurantName: decodedName });
    }

    // 3) If still not found -> 404
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // 4) return the menu array (safe fallback to empty array)
    const menu = Array.isArray(restaurant.menu) ? restaurant.menu : [];

    // OPTIONAL: prefix local uploads with server host so front-end can directly use item.image
    const hostPrefix = `${req.protocol}://${req.get("host")}`; // e.g. http://localhost:5001
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

