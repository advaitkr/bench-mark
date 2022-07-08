import mongoose from "mongoose";
const { Schema } = mongoose;

const FileUploadSchema = new Schema({
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  absolutePath: { type: String, },
  mimetype: { type: String, required: true },
  status: { type: Number, default: 0 },
},{ timestamps: true });
const fileUpload = mongoose.model("fileUpload", FileUploadSchema);
export default fileUpload;
