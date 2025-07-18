// const mongoose = require('mongoose');

// const restaurantSchema = new mongoose.Schema({
//   restaurantName: String,
//   firstName: String,
//   lastName: String,
//   contact: String,
//   address: String,
//   email: { type: String, unique: true },
//   password: String,
//   tables: { type: Number, default: 0 },
//   menu: [
//     {
//       name: String,
//       price: Number,
//       imageUrl: String // ✅ add this
//     }
//   ]
// });

// module.exports = mongoose.model('Restaurant', restaurantSchema);

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String,
  category: {
    type: String,
    enum: ['Starters', 'Mains', 'Desserts', 'Beverages'],
    default: 'Mains'
  }
});

const restaurantSchema = new mongoose.Schema({
  restaurantName: { type: String, unique: true },
  firstName: String,
  lastName: String,
  contact: String,
  address: String,
  email: { type: String, unique: true },
  password: String,
  tables: { type: Number, default: 0 },
  menu: [menuItemSchema]
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
