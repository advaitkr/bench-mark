import mongoose from "mongoose";
const { Schema } = mongoose;

const VendorProductSchema = new Schema(
  {
    productCategory: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ProductCategory",
    },
    name: { type: String, required: true },
    code: { type: String, default: 0 },
    images: [{ type: String }],
    videos: [{ type: String }],
    description: { type: String, required: true },
    price: { type: Number, required: true }
  },
  { timestamps: true }
);
const vendorProduct = mongoose.model("VendorProduct", VendorProductSchema);
export default vendorProduct;
//status : 0 = inactive
//status : 1 = active
//status : -1 = rejected
//status : -2 = soft delete
//status : -3 = draft pending
//status : -4 = draft rejected
