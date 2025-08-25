import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,   // Starter, Main Course, Dessert, etc.
  },
  image: {
    type: String,     // yaha file ka path ya image ka URL store hoga
    required: true
  },
  cuisine: {
    type: String,     // cuisine: Indian, Japanese, Chinese...
    required: true
  },
  timeToPrepare: {
    type: String
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);
