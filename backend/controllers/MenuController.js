import mongoose from "mongoose";

import Restaurant from "../models/Restaurant.js";

import MenuItem from "../models/MenuItem.js";
import fs from "fs";
import { formatDate, readSheetsToJson } from "../utility/common.js";

export const addMenuItem = async (req, res) => {
  try {
    if (!req.restaurant) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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
    } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.menu = restaurant.menu || [];

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    let rawStatus = (req.body.status || "Published").toString().trim();
    const status = ["Published", "Draft"].includes(rawStatus)
      ? rawStatus
      : "Published";

    restaurant.menu.push({
      _id: new mongoose.Types.ObjectId(),
      name,
      price,
      category,
      image: imagePath,
      cuisine,
      prepTime: timeToPrepare,
      ingredients: ingredients
        ? Array.isArray(ingredients)
          ? ingredients
          : [ingredients]
        : [],
      description: req.body.description || "Delicious & fresh!",
      status,
      type: type || "veg",
      discount: req.body.discount ? parseFloat(req.body.discount) : 0,
    });
    await restaurant.save();

    res.status(201).json({
      message: "Menu item added successfully",
      menuItem: restaurant.menu.at(-1),
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

    const menu = Array.isArray(restaurant.menu) ? restaurant.menu : [];

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

    const result = await Restaurant.findOneAndUpdate(
      { "menu._id": menuItemId },
      { $set: { "menu.$.status": status } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    const updatedMenuItem = result.menu.find(
      (item) => item._id && item._id.toString() === menuItemId.toString()
    );

    res.json({
      message: "Status updated successfully",
      menuItem: updatedMenuItem,
    });
  } catch (error) {
    console.error("Error updating menu status:", error);
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
    const existingItemNames = new Set(
      restaurant.menu.map((item) => item.name.toLowerCase().trim())
    );

    restaurant.menu = restaurant.menu || [];

    if (!restaurant?.rejectedItem) {
      restaurant.rejectedItems = [];
    }

    const { originalname, filename, path } = req.file;

    const bulkItemFileDoc = {
      fileLocalName: filename,
      filePath: path,
      fileOriginalName: originalname,
      uploadedBy: "admin",
    };

    restaurant.bulkItemFiles.push(bulkItemFileDoc);

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
          _id: new mongoose.Types.ObjectId(),
          ...item,
          reason: reason.join(", "),
          createdAt: new Date(),
        });
      } else {
        validItems.push({
          _id: new mongoose.Types.ObjectId(),
          ...sanitizedItem,
          prepTime: isValidPrepTime && item.preptime,
          status: "Draft",
        });
      }
    });

    for (const item of validItems) {
      const normalizedName = item.name?.toLowerCase().trim();
      if (!normalizedName || existingItemNames.has(normalizedName)) {
        rejectedItems.push({
          _id: new mongoose.Types.ObjectId(),
          ...item,
          reason: "Items already exists.",
          createdAt: new Date(),
        });
      } else {
        nonDuplicateItems.push(item);
        existingItemNames.add(normalizedName);
      }
    }

    await restaurant.save();

    if (validItems.length > 0 || rejectedItems.length > 0) {
      const updatedRes = await Restaurant.updateOne(
        { _id: restaurantId },
        {
          $push: {
            menu: { $each: nonDuplicateItems },
            rejectedItem: { $each: rejectedItems },
          },
        }
      );
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
