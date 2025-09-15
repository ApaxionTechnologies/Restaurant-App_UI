import mongoose from "mongoose";

const rejectedItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    category: {
      type: String,
    },
    image: {
      type: String,
    },
    cuisine: {
      type: String,
    },
    timeToPrepare: {
      type: String,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
    },
    status: {
      type: String,
    },
    type: { type: String },
    reason: {
      type: String,
    },
  },
  { timestamps: true, collection: "rejectedItems" }
);

const RejectedItems = mongoose.model("rejectedItems", rejectedItemSchema);

export default RejectedItems
