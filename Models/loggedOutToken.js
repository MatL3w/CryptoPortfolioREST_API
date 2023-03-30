import mongoose from "mongoose";

const loggedOutTokenSchema = new mongoose.Schema(
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

export default mongoose.model("LoggedOutToken", loggedOutTokenSchema);
