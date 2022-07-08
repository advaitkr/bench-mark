import mongoose from "mongoose";
const { Schema } = mongoose;

const HomeBannerSchema = new Schema({
  image: { type: String, required: true },
  status: { type: Number, default: 0 },
  description: { type: String },
  settings: { type: Object },
},{ timestamps: true });
const homeBanner = mongoose.model("homeBanner", HomeBannerSchema);
export default homeBanner;