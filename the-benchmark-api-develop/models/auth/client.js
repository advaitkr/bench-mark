import mongoose from "mongoose";
const { Schema } = mongoose;

const clientSchema = new Schema(
  {
    id: { type: String, required: true },
    clientId: { type: String, required: true },
    clientSecret: { type: String, required: true },
    grants: [{ type: String, required: true }],
    redirectUris: [{ type: String }],
    status: { type: String, default: 0 },
  },
  { timestamps: true }
);
const Client = mongoose.model("Client", clientSchema);
export default Client;
