import mongoose from "mongoose";
const { Schema } = mongoose;

const AdminProfileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  aadhar: { type: String, },
  gstNumber: { type: String },
  businessName: { type: String, required: true },
  aadharFilePath: { type: String, },
  gstFilePath: { type: String },
  gstStatus: { type: Number, default: 0 },
  settings: { type: Object },
  status: { type: Number, default: 0 },
  subscriptionEnabled: { type: Number, default: 0 },
  subscription: { type: Schema.Types.ObjectId, ref: "Subscription" },
  avgRating: { type: Number },
  ratingCount: { type: Number },
  percentageCutPerProductUnit: { type: Number, default: 0 },
  isPercentageCutPerProductUnitSet: { type: Boolean, default: false }, /* this is to check if percentageCutPerProductUnit
  has been set during initial vendor activation */
}, { timestamps: true });
const adminProfile = mongoose.model("AdminProfile", AdminProfileSchema);
export default adminProfile;
//status : 1 = active
//status : -1 = inactive
//status : 2 = subscribed
//status : -2 = unsubscribed
//status : -3 = subscription pay pending