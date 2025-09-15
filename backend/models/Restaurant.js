
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    line1: String,
    line2: String,
    country: String,
    state: String,
    city: String,
  },
  { _id: false }
);


const bulkItemFileSchema = new mongoose.Schema(
  {
    fileLocalName: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileOriginalName: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: String,
      required: true,
    }
  },
  {     
    timestamps: true,
  }
);



const restaurantSchema = new mongoose.Schema({
  restaurantName: { type: String, unique: true, required: true },
  ownerName: { type: String, required: true },   // ✅ added
  firstName: { type: String },                   // optional, keeping backward compatibility
  lastName: { type: String },                    // optional
  contact: { type: String, required: true },
  address: addressSchema,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  tables: { type: Number, default: 0 },
  categories: { type: [String], default: [] },   // ✅ added
  tagline: { type: String },                     // ✅ added
  image: { type: String },                       // main/cover image
  // ✅ New image fields
  logoImage: { type: String },                   // logo
  headerImage: { type: String },                 // header/banner
  footerImage: { type: String },                 // footer image
  // menu: { type: Array, default: [] },
});

const Restaurant =
  mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
