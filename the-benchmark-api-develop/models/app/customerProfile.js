import mongoose from "mongoose";
const { Schema } = mongoose;

const customerProfileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    firstName: { type: String, required: true },
    lastName: { type: String },
    phone: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);
const customerProfile = mongoose.model(
  "CustomerProfile",
  customerProfileSchema
);
export default customerProfile;
