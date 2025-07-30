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
// import mongoose from "mongoose";

// const menuItemSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   price: Number,
//   image: {
//     data: Buffer,
//     contentType: String,
//   },
// });

// export default mongoose.model("MenuItem", menuItemSchema);

// models/MenuItem.js
import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  category: String,
  name: String,
  price: Number,
  timeToPrepare: Number,
  // imageUrl: String,
  restaurantEmail: String,
});

export default mongoose.model("MenuItem", menuItemSchema);
