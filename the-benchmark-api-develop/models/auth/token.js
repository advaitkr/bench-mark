import mongoose from "mongoose";
const { Schema } = mongoose;

const tokenSchema = new Schema(
  {
    accessToken: { type: String, required: true },
    accessTokenExpiresAt: { type: Date, required: true },
    refreshTokenExpiresAt: { type: Date, required: true },
    refreshToken: { type: String, required: true },
    scope: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, required: true, ref: "Client" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    status: { type: String, default: 0 },
  },
  { timestamps: true }
);
const token = mongoose.model("Token", tokenSchema);
export default token;