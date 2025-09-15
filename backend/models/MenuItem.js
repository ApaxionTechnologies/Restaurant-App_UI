import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      // required: true
    },
    cuisine: {
      type: String,
      // required: true
    },
    prepTime: {
      type: String,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "Delicious & fresh!",
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },
    type: { type: String, enum: ["veg", "non-veg"], default: "veg" },
  },
  { timestamps: true, collection: "menuItems" }
);

export default mongoose.model("menuItem", menuItemSchema);
