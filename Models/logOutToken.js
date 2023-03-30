import mongoose from "mongoose";

const logOutTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("LogOutToken", logOutTokenSchema);
