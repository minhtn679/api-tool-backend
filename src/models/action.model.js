import mongoose from "mongoose";

const ActionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "User",
    },

    method: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    ip: {
      type: String,
      required: false,
    },
    statusCode: {
      type: Number,
      required: false,
    },
    executionTime: {
      type: Number,
      required: false,
    },
    body: {
      type: Object,
      required: false,
    },
    params: {
      type: Object,
      required: false,
    },
    orders: {
      type: [
        {
          type: Object,
        },
      ],
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Action", ActionSchema);
