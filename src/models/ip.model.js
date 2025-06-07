import mongoose from "mongoose";

const IpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ip: {
      type: String,
      required: false,
    },
    fp: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ip", IpSchema);
