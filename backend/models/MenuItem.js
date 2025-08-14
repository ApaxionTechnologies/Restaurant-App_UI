
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
