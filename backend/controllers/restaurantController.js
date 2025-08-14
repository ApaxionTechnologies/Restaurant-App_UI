// controllers/restaurantController.js
import Restaurant from "../models/Restaurant.js";

// Register a new restaurant
export const registerRestaurant = async (req, res) => {
  try {
    const { restaurantName, firstName, lastName, contact, email, password, tables, address } = req.body;

    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ error: "Restaurant with this email already exists!" });
    }

    const newRestaurant = new Restaurant({
      restaurantName,
      firstName,
      lastName,
      contact,
      email,
      password, // In production, hash it!
      tables,
      address,
    });

    await newRestaurant.save();
    res.status(201).json({ message: "Restaurant registered successfully!", restaurant: newRestaurant });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login
export const loginRestaurant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const restaurant = await Restaurant.findOne({ email });

    if (!restaurant || restaurant.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      restaurant: {
        id: restaurant._id,
        name: restaurant.restaurantName,
        email: restaurant.email,
        tables: restaurant.tables,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// Get a restaurant by email
export const getRestaurantByEmail = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email);
    const restaurant = await Restaurant.findOne({ email: decodedEmail });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({ restaurant });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch restaurant" });
  }
};

// Update tables
export const updateTables = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email);
    const { tables } = req.body;

    const restaurant = await Restaurant.findOne({ email: decodedEmail });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    restaurant.tables = tables;
    await restaurant.save();

    res.status(200).json({ message: "Tables updated successfully" });
  } catch (err) {
    console.error("❌ Table update error:", err);
    res.status(500).json({ error: "Failed to update tables" });
  }
};

// Delete a restaurant
export const deleteRestaurant = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email);
    const result = await Restaurant.findOneAndDelete({ email: decodedEmail });

    if (!result) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Failed to delete restaurant" });
  }
};

// Update restaurant profile
export const updateRestaurant = async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email);
    const updatedData = req.body;

    const updated = await Restaurant.findOneAndUpdate(
      { email: decodedEmail },
      updatedData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({ message: "Restaurant updated", restaurant: updated });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ error: "Failed to update restaurant" });
  }
};
