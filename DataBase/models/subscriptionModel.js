import mongoose, { Model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    tourDetails: { type: Types.ObjectId, required: true, ref: "tour" },
    userDetails: { type: Types.ObjectId, required: true, ref: "user" },
    time: { type: String, required: true },
    date: { type: String, required: true },
    day: {
      type: String,
      enum: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
    adultPricing: {
      adults: { type: Number },
      price: { type: Number },
      totalPrice: { type: Number },
    },
    childrenPricing: {
      children: { type: Number },
      price: { type: Number },
      totalPrice: { type: Number },
    },
    options: [
      {
        name: { type: String },
        number: { type: Number },
        numberOfChildren: { type: Number },
        childPrice: { type: Number },
        price: { type: Number },
        totalPrice: { type: Number },
      },
    ],
    totalPrice: { type: Number, required: true },
    payment: { type: String, enum: ["pending", "success"], default: "pending" },
  },
  { timestamps: true }
);

schema.pre(/^find/, async function (next) {
  this.populate({
    path: "tourDetails",
    select: "mainImg title description", // Specify the fields you want to include
  });
  this.populate({
    path: "userDetails",
    select: "avatar name email nationality -wishList",
  });
  next();
});
schema.post("save", async function (next) {
  this.populate({
    path: "tourDetails",
    select: "mainImg title description", // Specify the fields you want to include
  });
  this.populate({
    path: "userDetails",
    select: "avatar name email nationality -wishList",
  });
  next();
});

const subscriptionModel = mongoose.model("subscription", schema);

export default subscriptionModel;
