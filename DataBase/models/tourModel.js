import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mainImg: {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  },
  images: [
    {
      url: { type: String },
      public_id: { type: String }
    }
  ],
  options: [
    {
      name: { type: String },
      price: { type: Number }
    }
  ],
  isRepeated: { type: Boolean, default: true },
  repeatTime: [{ type: String }],
  repeatDays: [
    {
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
    }
  ],

  dateDetails: { type: String },
  location: {
    from: { type: String, required: true },
    to: { type: String, required: true }
  },
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  adultPricing: [
    {
      adults: { type: Number },
      price: { type: Number },
      totalPrice: {
        type: Number,
        default: function () {
          return this.adults * this.price;
        }
      }
    }
  ],
  childrenPricing: [
    {
      children: { type: Number },
      price: { type: Number },
      totalPrice: {
        type: Number,
        default: function () {
          return this.children * this.price;
        }
      }
    }
  ],
  duration: { type: String },
  subtitle: { type: String }
});

// schema.pre("save", function (next) {
//   // Calculate total price for adultPricing
//   this.adultPricing.forEach((adult) => {
//     adult.totalPrice = adult.adults * adult.pricePerPerson;
//   });

//   // Calculate total price for childrenPricing
//   this.childrenPricing.forEach((child) => {
//     child.totalPrice = child.children * child.pricePerPerson;
//   });

//   next();
// });

// schema.pre("find", function () {
//   this.populate({ path: "createdBy", model: "user" });
// });

const tourModel = mongoose.model("tour", schema);

export default tourModel;
