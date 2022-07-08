import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    newUsername: {type: String, unique: true},
    otp: {
      code: { type: String },
      codeExpiresAt: {
        type: Date,
      },
    },
    password: { type: String },
    status: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
// status : 1 = active
// status : -1 = inactive
