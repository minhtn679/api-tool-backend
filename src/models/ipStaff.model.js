import mongoose from "mongoose";

const ipStaffSchema = new mongoose.Schema(
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
    producer: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ipStaff", ipStaffSchema);
