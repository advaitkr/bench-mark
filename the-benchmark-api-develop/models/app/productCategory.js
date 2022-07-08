import mongoose from "mongoose";
const { Schema } = mongoose;

const ProductCategorySchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    slug: { type: String, required: true, unique: true },
    parentId: { type: String }
  },
  { timestamps: true }
);
const productCategory = mongoose.model(
  "ProductCategory",
  ProductCategorySchema
);
export default productCategory;
