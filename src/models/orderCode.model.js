import mongoose from "mongoose";

const OrderCodeSchema = new mongoose.Schema(
  {
    orderCode: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("OrderCode", OrderCodeSchema);
