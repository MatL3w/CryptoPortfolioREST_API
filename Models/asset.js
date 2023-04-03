import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
  },
  symbol: {
    type: String,
  },
});
export default mongoose.model("Asset", assetSchema);
