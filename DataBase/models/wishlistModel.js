import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    tours: [{ type: mongoose.Types.ObjectId, ref: "tour" }],
    user: { type: mongoose.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

schema.pre(/^find/, async function (next) {
  this.populate({ path: "tours", select: "mainImg title description" });
  this.populate({ path: "user", select: "avatar name email nationality" });
  next();
});

const wishListModel = mongoose.model("wishlist", schema);

export default wishListModel;
