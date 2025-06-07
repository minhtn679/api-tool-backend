import mongoose from "mongoose";

const schema = new mongoose.Schema({
   user: { type: mongoose.Types.ObjectId, ref: "User" },
   token: String,
   createdByIp: String,
});

schema.virtual("isExpired").get(function () {
   return Date.now() >= this.expires;
});

schema.virtual("isActive").get(function () {
   return !this.revoked && !this.isExpired;
});

schema.set("toJSON", {
   virtuals: true,
   versionKey: false,
   transform: function (doc, ret) {
      delete ret._id;
      delete ret.id;
      delete ret.user;
   },
});
export default mongoose.model("RefreshToken", schema);
