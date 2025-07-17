const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantName: String,
  firstName: String,
  lastName: String,
  contact: String,
  address: String,
  email: { type: String, unique: true },
  password: String,
  tables: { type: Number, default: 0 },
  menu: [
    {
      name: String,
      price: Number,
      imageUrl: String // ✅ add this
    }
  ]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
