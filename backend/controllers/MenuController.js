import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";
import fs from "fs";
import { formatDate, readSheetsToJson } from "../utility/common.js";
import RejectedItems from "../models/rejectedItems.js";
import BulkFileDetails from "../models/ItemFileModal.js";

export const addMenuItem = async (req, res) => {
  try {
    if (!req.restaurant) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.restaurant;
    const {
      name,
      price,
      ingredients,
      description,
      type,
      category,
      cuisine,
      prepTime,
      discount,
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    let rawStatus = (req.body.status || "Published").toString().trim();
    const status = ["Published", "Draft"].includes(rawStatus)
      ? rawStatus
      : "Published";

    const menuItemDoc = {
      restaurantId: id,
      name,
      price,
      category,
      image: imagePath,
      cuisine,
      prepTime,
      ingredients: ingredients
        ? Array.isArray(ingredients)
          ? ingredients
          : [ingredients]
        : [],
      description: req.body.description || "Delicious & fresh!",
      status,
      type: type || "veg",
      discount: discount ? parseFloat(discount) : 0,
    };

    const menuDoc = new MenuItem(menuItemDoc);

    const savedMenuData = await menuDoc.save();

    if (savedMenuData) {
      return res.status(201).json({
        message: "Menu item added successfully",
        menuItem: savedMenuData,
      });
    }
    return res.status(500).json({
      message: "Failed to create menu item",
    });
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

    const menu = await MenuItem.find({
      restaurantId: restaurant._id,
    });

    const publishedMenu = menu.filter((it) => {
      const s = (it.status || "").toString().trim().toLowerCase();
      return s === "published";
    });

    const hostPrefix = `${req.protocol}://${req.get("host")}`;

    const menuWithFullImage = menu.map((it) => ({
      ...(it.toObject?.() ?? it),
      image:
        it.image && !it.image.startsWith("http")
          ? `${hostPrefix}${it.image}`
          : it.image,
      type: (it.type || "veg").toLowerCase(),
    }));

    return res.status(200).json({
      restaurant: {
        name: restaurant.restaurantName,
        tagline: restaurant.tagline,
        image: restaurant.image ? `${hostPrefix}${restaurant.image}` : null,
      },
      menu: menuWithFullImage,
    });
  } catch (err) {
    console.error("Error in getMenuByRestaurantId:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
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
    if (id && id.toString().startsWith("temp-")) {
      return res
        .status(400)
        .json({ message: "Cannot update temporary menu items" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid menu item ID format" });
    }

    const menuItemId = new mongoose.Types.ObjectId(id);

    const result = await MenuItem.findOneAndUpdate(
      { _id: menuItemId },
      { $set: { status: status } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({
      message: "Status updated successfully",
      menuItem: result,
    });
  } catch (error) {
    console.error("Error updating menu status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    if (!req.restaurant) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const restaurantId = req.restaurant.id;
    const {
      name,
      price,
      ingredients,
      description,
      type,
      category,
      cuisine,
      timeToPrepare,
      status,
      discount,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid menu item ID format" });
    }

    const menuItemId = new mongoose.Types.ObjectId(id);
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItemIndex = restaurant.menu.findIndex(
      (item) => item._id && item._id.toString() === menuItemId.toString()
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
      ingredients: ingredients
        ? Array.isArray(ingredients)
          ? ingredients
          : [ingredients]
        : [],
      description: description || "Delicious & fresh!",
      status: status || "Published",
      type: type || "veg",
      discount: discount ? parseFloat(discount) : 0,
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

    res.json({
      message: "Menu item updated successfully",
      menuItem: restaurant.menu[menuItemIndex],
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
    const menuItemIndex = restaurant.menu.findIndex(
      (item) => item._id && item._id.toString() === menuItemId.toString()
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

    const menuItem = restaurant.menu.find(
      (item) => item._id && item._id.toString() === menuItemId.toString()
    );

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const hostPrefix = `${req.protocol}://${req.get("host")}`;
    const menuItemWithFullImage = {
      ...(menuItem.toObject?.() ?? menuItem),
      image:
        menuItem.image && !menuItem.image.startsWith("http")
          ? `${hostPrefix}${menuItem.image}`
          : menuItem.image,
    };

    res.json({ menuItem: menuItemWithFullImage });
  } catch (error) {
    console.error("Error getting menu item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addBulkMenuItem = async (req, res) => {
  try {
    if (!req.restaurant) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Unauthorized" });
    }

    const restaurantId = req.restaurant.id;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Restaurant not found" });
    }

    const allowedCategories = restaurant.categories;

    if (!restaurant?.rejectedItem) {
      restaurant.rejectedItems = [];
    }

    const { originalname, filename, path } = req.file;

    const bulkItemFileDoc = {
      restaurantId: new mongoose.Types.ObjectId(restaurantId),
      fileLocalName: filename,
      filePath: path,
      fileOriginalName: originalname,
      uploadedBy: "admin",
    };

    // restaurant.bulkItemFiles.push(bulkItemFileDoc);

    const fileDoc = await new BulkFileDetails(bulkItemFileDoc);

    const fileRes = await fileDoc.save();

    const filePath = req.file ? `./uploads/${req.file.filename}` : "";

    const fileJsonData = await readSheetsToJson(filePath);
    const fileData = fileJsonData.Sheet1;
    const totalItemsCount = fileData.length;

    if (fileData.length < 1) {
      return res
        .status(404)
        .json({ status: "Failed", message: "No data in file" });
    }

    const allowedTypes = ["veg", "non-veg"];

    let nonDuplicateItems = [];
    let validItems = [];
    let rejectedItems = [];
    const allowedFields = [
      "name",
      "price",
      "category",
      "image",
      "cuisine",
      "description",
      "prepTime",
      "type",
      "discount",
    ];

    fileData.forEach((item) => {
      const { name, price, category, preptime, type, discount, description } =
        item;

      let reason = [];
      let isValidPrepTime = true;

      if (!name || name.trim() === "") {
        reason.push("Name field not present");
      }

      // if (!description || description.trim() === "") {
      //   item.description = "Delicious & fresh!";
      // }

      if (price == null || isNaN(price) || price < 0) {
        reason.push("Price must be a valid non-negative number");
      }

      if (!allowedCategories.includes(category)) {
        reason.push(`Category must be one of: ${allowedCategories.join(", ")}`);
      }

      if (preptime == null || isNaN(preptime) || preptime <= 0) {
        isValidPrepTime = false;
        reason.push("Preparation time must be a positive number");
      }

      if (!allowedTypes.includes(type?.toLowerCase())) {
        reason.push("Type must be either 'veg' or 'non-veg'");
      }

      if (discount) {
        if (isNaN(discount) || discount < 0) {
          reason.push("Discount must be a valid positive number if provided");
        }
      }

      const sanitizedItem = allowedFields.reduce((acc, field) => {
        if (item[field] !== undefined) acc[field] = item[field];
        return acc;
      }, {});

      if (reason.length > 0) {
        rejectedItems.push({
          ...item,
          restaurantId: new mongoose.Types.ObjectId(restaurantId),
          reason: reason.join(", "),
        });
      } else {
        validItems.push({
          restaurantId: new mongoose.Types.ObjectId(restaurantId),
          ...sanitizedItem,
          prepTime: isValidPrepTime && item.preptime,
          status: "Draft",
        });
      }
    });

    if (validItems.length > 0) {
      const result = await RejectedItems.insertMany(rejectedItems, {
        ordered: false,
      });
    }
    if (validItems.length > 0) {
      const result = await MenuItem.insertMany(validItems, {
        ordered: false,
      });
    }

    await fs.unlinkSync(filePath);

    const rejctedList = rejectedItems.map((item) => ({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      prepTime: item.preptime,
      type: item.type,
      discount: item.discount,
      reason: item.reason,
      createdAt: formatDate(item.createdAt),
    }));

    return res.status(201).json({
      status: "Success",
      message: "Menu item added successfully",
      data: {
        totalValidItems: nonDuplicateItems.length,
        totalRejectedItems: rejectedItems.length,
        totalItems: totalItemsCount,
        rejctedList,
      },
    });
  } catch (error) {
    console.error("Error in addMenuItem:", error);
    res.status(500).json({
      status: "Failed",
      message: "Server error",
      error: error.message,
    });
  }
};
