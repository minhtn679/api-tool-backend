import mongoose from "mongoose";

const UsdExchangeRate = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("UsdExchangeRate", UsdExchangeRate);
