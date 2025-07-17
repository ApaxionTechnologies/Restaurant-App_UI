// routes/menu.js
const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");

// GET: Menu items by restaurant email
router.get("/", async (req, res) => {
  const { email } = req.query;
  const restaurant = await Restaurant.findOne({ email });
  if (!restaurant) return res.status(404).json({ menu: [] });

  const menu = await Menu.find({ restaurantId: restaurant._id });
  res.json({ menu });
});

// POST: Add menu item
router.post("/add", async (req, res) => {
  const { email, item } = req.body;
  const restaurant = await Restaurant.findOne({ email });
  if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

  await Menu.create({ ...item, restaurantId: restaurant._id });
  res.json({ message: "Menu item added" });
});

// DELETE: Delete menu item by name
router.delete("/delete", async (req, res) => {
  const { email, name } = req.body;
  const restaurant = await Restaurant.findOne({ email });
  if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

  await Menu.deleteOne({ name, restaurantId: restaurant._id });
  res.json({ message: "Menu item deleted" });
});

module.exports = router;
