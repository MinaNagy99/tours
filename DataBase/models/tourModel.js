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
  repeatTime: [{ type: Number }],
  RepeatDays: [
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
  lacation: {
    from: { type: String, required: true },
    to: { type: String, required: true }
  },
  inclusions: [{ type: String }],
  exclusions: [{ typr: String }],
  adultPricing: [
    {
      adults: { type: Number },
      pricePerPerson: { type: Number }
    }
  ],
  childrenPricing: [
    {
      children: { type: Number },
      pricePerPerson: { type: Number }
    }
  ],
  duration: { type: String },
  subtitle: { type: String },

  tourParticipants: [{ type: Types.ObjectId, ref: "user" }]
});

// schema.pre("find", function () {
//   this.populate({ path: "createdBy", model: "user" });
// });
const tourModel = mongoose.model("tour", schema);

export default tourModel;
