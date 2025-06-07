import mongoose from "mongoose";
import { SALE_SERVICES } from "../common/constant.js";

const CartItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },

    domain: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Domain",
    },

    quantity: {
      type: Number,
      default: 0,
    },

    service: {
      type: String,
      enum: [...Object.values(SALE_SERVICES)],
      required: true,
    },

    overallAmount: {
      type: Number,
    },
    discountAmount: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CartItem", CartItemSchema);
