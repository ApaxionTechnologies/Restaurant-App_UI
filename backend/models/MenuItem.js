// models/Menu.js
const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  name: String,
  category: String, // e.g., "Starters", "Mains", etc.
  price: Number,
  image: String,
});

module.exports = mongoose.model("Menu", menuItemSchema);
