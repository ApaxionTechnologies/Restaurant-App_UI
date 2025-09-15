import mongoose from "mongoose";

const itemFileSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    fileLocationName: {
      type: String,
    //   required: true,
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
      required: true
    }
  },
  { timestamps: true, collection: "bulkFileDetails" }
);

const BulkFileDetails = mongoose.model("bulkFileDetails", itemFileSchema);

export default BulkFileDetails
