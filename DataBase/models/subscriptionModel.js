import mongoose, { Model, Schema, Types } from "mongoose";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
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
        "Saturday"
      ]
    },
    adultPricing: {
      adults: { type: Number },
      pricePerPerson: { type: Number }
    },
    childrenPricing: {
      children: { type: Number },
      pricePerPerson: { type: Number }
    },
    options: [
      {
        name: { type: String },
        price: { type: Number }
      }
    ],
    totalPrice: { type: Number, required: true },
    payment: { type: String, enum: ["pending", "success"], default: "pending" }
  },
  { timestamps: true }
);

schema.pre(/^find/, async function (next) {
  this.populate("tourDetails");
  this.populate("userDetails");
  next();
});

const subscriptionModel = mongoose.model("subscription", schema);

export default subscriptionModel;
