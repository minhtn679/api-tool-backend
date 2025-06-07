import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
   userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
   },
   token: { type: String, required: true },
   createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 300,
   },
});
export default mongoose.model("Token", TokenSchema);
