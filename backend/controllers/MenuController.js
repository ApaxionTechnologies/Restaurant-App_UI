import mongoose from "mongoose";
 
import Restaurant from "../models/Restaurant.js";

import MenuItem from "../models/MenuItem.js";
 
export const addMenuItem = async (req, res) => {
  try {
    if (!req.restaurant) {
      return res.status(401).json({ message: "Unauthorized" });
    }
 
    const restaurantId = req.restaurant.id;
    const { name, price, ingredients, description,type, category, cuisine, timeToPrepare } = req.body;
 
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
 
    restaurant.menu = restaurant.menu || [];
 
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
 
    let rawStatus = (req.body.status || "Published").toString().trim();
    const status = ["Published", "Draft"].includes(rawStatus) ? rawStatus : "Published";

restaurant.menu.push({
  _id: new mongoose.Types.ObjectId(),
  name,
  price,
  category,
  image: imagePath,
  cuisine,
  prepTime: timeToPrepare,
  ingredients: ingredients ? (Array.isArray(ingredients) ? ingredients : [ingredients]) : [],
  description: req.body.description || "Delicious & fresh!",
  status,
  type: type || "veg",
  discount: req.body.discount ? parseFloat(req.body.discount) : 0
 } );
    await restaurant.save();
 
    res.status(201).json({ message: "Menu item added successfully", menuItem: restaurant.menu.at(-1) });
  } catch (error) {
    console.error("Error in addMenuItem:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
 
 
//  Get Menu by Restaurant ID or Name
 
export const getMenuByRestaurantId = async (req, res) => {
  const param = req.params.restaurantId;
  try {
    let restaurant = null;
 
    if (mongoose.Types.ObjectId.isValid(param)) {
      restaurant = await Restaurant.findById(param);
    }
 
    if (!restaurant) {
      const decodedName = decodeURIComponent(param);
      restaurant = await Restaurant.findOne({ restaurantName: decodedName });
    }
 
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
 
    const menu = Array.isArray(restaurant.menu) ? restaurant.menu : [];
 
    const publishedMenu = menu.filter((it) => {
      const s = (it.status || "").toString().trim().toLowerCase();
      return s === "published";
    });
 
 
    const hostPrefix = `${req.protocol}://${req.get("host")}`;
 
    const menuWithFullImage = menu.map((it) => ({
  ...it.toObject?.() ?? it,
  image: it.image && !it.image.startsWith("http")
    ? `${hostPrefix}${it.image}`
    : it.image,
  type: (it.type || "veg").toLowerCase()
}));

return res.status(200).json({
  restaurant: {
    name: restaurant.restaurantName,
    tagline: restaurant.tagline,
    image: restaurant.image
      ? `${hostPrefix}${restaurant.image}`
      : null
  },
  menu: menuWithFullImage   
});

  } catch (err) {
    console.error("Error in getMenuByRestaurantId:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// for update menu status

export const updateMenuStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Published", "Draft"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (id && id.toString().startsWith('temp-')) {
      return res.status(400).json({ message: "Cannot update temporary menu items" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid menu item ID format" });
    }

    const menuItemId = new mongoose.Types.ObjectId(id);

    const result = await Restaurant.findOneAndUpdate(
      { "menu._id": menuItemId },
      { $set: { "menu.$.status": status } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    const updatedMenuItem = result.menu.find(item => 
      item._id && item._id.toString() === menuItemId.toString()
    );

    res.json({ message: "Status updated successfully", menuItem: updatedMenuItem });
  } catch (error) {
    console.error("Error updating menu status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    if (!req.restaurant) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const restaurantId = req.restaurant.id;
    const { name, price, ingredients, description, type, category, cuisine, timeToPrepare, status, discount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid menu item ID format" });
    }

    const menuItemId = new mongoose.Types.ObjectId(id);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItemIndex = restaurant.menu.findIndex(item =>
      item._id && item._id.toString() === menuItemId.toString()
    );

    if (menuItemIndex === -1) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Update fields
    const updateData = {
      name,
      price,
      category,
      cuisine,
      prepTime: timeToPrepare,
      ingredients: ingredients ? (Array.isArray(ingredients) ? ingredients : [ingredients]) : [],
      description: description || "Delicious & fresh!",
      status: status || "Published",
      type: type || "veg",
      discount: discount ? parseFloat(discount) : 0
    };

    // Handle image update if new file is uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Update the menu item
    Object.assign(restaurant.menu[menuItemIndex], updateData);
console.log("Before save:", restaurant.menu[menuItemIndex]);
await restaurant.save();
console.log("After save:", restaurant.menu[menuItemIndex]);


    res.json({ message: "Menu item updated successfully", menuItem: restaurant.menu[menuItemIndex] });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    if (!req.restaurant) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const restaurantId = req.restaurant.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid menu item ID format" });
    }

    const menuItemId = new mongoose.Types.ObjectId(id);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find the menu item index
    const menuItemIndex = restaurant.menu.findIndex(item =>
      item._id && item._id.toString() === menuItemId.toString()
    );

    if (menuItemIndex === -1) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Remove the menu item
    restaurant.menu.splice(menuItemIndex, 1);
    await restaurant.save();

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single menu item
export const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid menu item ID format" });
    }

    const menuItemId = new mongoose.Types.ObjectId(id);
    const restaurant = await Restaurant.findOne({ "menu._id": menuItemId });

    if (!restaurant) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const menuItem = restaurant.menu.find(item =>
      item._id && item._id.toString() === menuItemId.toString()
    );

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const hostPrefix = `${req.protocol}://${req.get("host")}`;
    const menuItemWithFullImage = {
      ...menuItem.toObject?.() ?? menuItem,
      image: menuItem.image && !menuItem.image.startsWith("http")
        ? `${hostPrefix}${menuItem.image}`
        : menuItem.image
    };

    res.json({ menuItem: menuItemWithFullImage });
  } catch (error) {
    console.error("Error getting menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};