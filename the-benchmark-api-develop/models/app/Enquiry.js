import mongoose from "mongoose";
const { Schema } = mongoose;

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {type: String, required: true},
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "ProductCategory",
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);
const Enquiry = mongoose.model("Enquiry", EnquirySchema);
export default Enquiry;