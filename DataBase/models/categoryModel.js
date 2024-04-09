import mongoose, { Schema } from "mongoose";
const schema = new Schema(
  {
    name: { type: String, required: true }
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("category", schema);

export default categoryModel;
