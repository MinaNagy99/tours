import mongoose, { Types } from "mongoose";
import subscriptionModel from "../../DataBase/models/subscriptionModel.js";
import tourModel from "../../DataBase/models/tourModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import Stripe from "stripe";
import { ApiFeature } from "../../utilities/AppFeature.js";
const stripe = new Stripe(
  "sk_test_51MoELVIKyDCqLTCrTSGScHAnyU4bkNNxZq6eJJky0t5Uem7zz6uhtjMrS1R3Gw75x2zzYymXFX9WwvyckNKqNGgm00aKssCNvV"
);

const createSubscription = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;

  try {
    const tour = await tourModel.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const { adultPricing, childrenPricing, options } = req.body;
    req.body.userDetails = _id;
    req.body.tourDetails = id;

    const Fethingoptions = await tourModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $unwind: "$options" },
      {
        $match: {
          "options._id": { $in: options.map((id) => new ObjectId(id)) }
        }
      },
      { $project: { options: 1 } },
      {
        $replaceRoot: { newRoot: "$options" }
      }
    ]);
    const FetchingChildPrice = await tourModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $unwind: "$childrenPricing" },
      {
        $match: { "childrenPricing._id": new ObjectId(childrenPricing) }
      },
      { $project: { childrenPricing: 1, _id: 0 } },
      { $replaceRoot: { newRoot: "$childrenPricing" } }
    ]);
    const FetchingAdultPrice = await tourModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $unwind: "$adultPricing" },
      {
        $match: { "adultPricing._id": new ObjectId(adultPricing) }
      },
      { $project: { adultPricing: 1, _id: 0 } },
      { $replaceRoot: { newRoot: "$adultPricing" } }
    ]);
    // const totalPriceOfOptions = Fethingoptions.map(
    //   (option) => option.price
    // ).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    res.send({
      children: FetchingChildPrice,
      adult: FetchingAdultPrice,
      options: Fethingoptions
    });

    // Assuming subscriptionModel is your model for subscriptions
    // const resultOfSubscription = new subscriptionModel(req.body);
    // await resultOfSubscription.save();
    // res.status(200).json({ message: "Subscription created successfully", data: resultOfSubscription });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getAllSubscription = catchAsyncError(async (req, res, next) => {
  const apiFeature = new ApiFeature(subscriptionModel.find(), req.query)
    .paginate()
    .fields()
    .filter()
    .sort()
    .search();
  const result = await apiFeature.mongoseQuery;
  if (!result) {
    return next(new AppError("can't find subscriptions"));
  }

  res
    .status(200)
    .send({ message: "success", data: { page: apiFeature.page, result } });
});

export { createSubscription, getAllSubscription };
