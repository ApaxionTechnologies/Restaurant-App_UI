const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  timeToPrepare: String,
  imageUrl: String,
});

module.exports = mongoose.model("MenuItem", menuItemSchema);


module.exports = mongoose.model("Menu", menuItemSchema);
