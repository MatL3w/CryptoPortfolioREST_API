import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    assets: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Data", dataSchema);
