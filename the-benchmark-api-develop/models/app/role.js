import mongoose from "mongoose";
const { Schema } = mongoose;

const roleSchema = new Schema({
  name: { type: String, required: true },
  scopes: [String],
  status: Number,
},{ timestamps: true });
const role = mongoose.model("Role", roleSchema);
export default role;