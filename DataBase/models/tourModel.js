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
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }
  ],
  options: [
    {
      name: { type: String },
      price: { type: Number }
    }
  ],

  dateOfTour: { type: String, required: true },
  lacation: { type: String, required: true },
  inclusions: [{ type: String }],
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
