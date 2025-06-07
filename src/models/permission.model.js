import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
const permissionSchema = new mongoose.Schema(
  {
    role: {
      type: ObjectId,
      ref: "Role",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    add: {
      type: Boolean,
      default: false,
    },
    view: {
      type: Boolean,
      default: false,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    viewDetailUser: {
      type: Boolean,
    },
    ext: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);
export default mongoose.model("Permission", permissionSchema);
