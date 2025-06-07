import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Role",
    },
    avatar: {
      type: String,
      default: "/avatar.jpg",
    },

    // ngân hàng
    bankNumber: {
      type: String,
    },
    bankName: {
      type: String,
    },
    nameInCard: {
      type: String,
    },

    // contact
    email: {
      type: String,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    telegramUsername: {
      type: String,
    },
    telegram: {
      type: String,
    },
    zalo: {
      type: String,
      default: "",
    },
    note: {
      type: String,
    },
    facebook: {
      type: String,
      default: "",
    },
    // end contact

    status: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3, 4], // 0: pending, 1: veryfied, 2: approve / active, 3: reject, 4: blocked
    },
    deletedAt: {
      default: null,
      type: Date,
    },

    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.password;
  },
});
export default mongoose.model("User", UserSchema);
