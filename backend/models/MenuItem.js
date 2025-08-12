// const mongoose = require("mongoose");

// const menuItemSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   timeToPrepare: String,
//   imageUrl: String,
// });

// module.exports = mongoose.model("MenuItem", menuItemSchema);


// module.exports = mongoose.model("Menu", menuItemSchema);

// models/MenuItem.js
import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  restaurantEmail: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String
  },
  timeToPrepare: {
    type: String
  }
});

export default mongoose.model('MenuItem', menuItemSchema);
