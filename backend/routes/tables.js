// routes/tables.js
const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");

// GET number of tables
router.get("/", async (req, res) => {
  const { email } = req.query;
  const restaurant = await Restaurant.findOne({ email });
  if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

  res.json({ tables: restaurant.tables });
});

// POST: Update number of tables
router.post("/update", async (req, res) => {
  const { email, tables } = req.body;
  const restaurant = await Restaurant.findOne({ email });
  if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

  restaurant.tables = tables;
  await restaurant.save();
  res.json({ message: "Table count updated", tables: restaurant.tables });
});

module.exports = router;
