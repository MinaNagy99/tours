import mongoose, { Types } from "mongoose";
import subscriptionModel from "../../DataBase/models/subscriptionModel.js";
import tourModel from "../../DataBase/models/tourModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51MoELVIKyDCqLTCrTSGScHAnyU4bkNNxZq6eJJky0t5Uem7zz6uhtjMrS1R3Gw75x2zzYymXFX9WwvyckNKqNGgm00aKssCNvV"
);

const createSubscription = catchAsyncError(async (req, res, next) => {
  console.log('hii');
  const { _id } = req.user;
  const { id } = req.params;
  console.log(req.params.id);
  console.log(req.body.tourId);
  const tour = await tourModel.findById(req.body.tourId[0]);
  const { adultPricing, childrenPricing, options } = req.body;
  req.body.userDetails = _id;
  req.body.tourDetails = id;
  req.body.adultPricing = tour.adultPricing.filter((element) => {
    return element._id == adultPricing;
  })[0];
  req.body.childrenPricing = tour.childrenPricing.filter((element) => {
    return element._id == childrenPricing;
  })[0];

  req.body.totalPrice =
    tour.childrenPricing.filter((element) => {
      return element._id == childrenPricing;
    })[0].totalPrice +
    tour.adultPricing.filter((element) => {
      return element._id == adultPricing;
    })[0].totalPrice;

  const resultOfSubscription = new subscriptionModel(req.body);
  // await resultOfSubscription.save(req.body);
  res.status(200).send({ message: "success", data: tour });
});

const getAllSubscription = catchAsyncError(async (req, res, next) => {
  const subscription = await subscriptionModel.find();
  res.status(200).send({ message: "success", data: subscription });
});


export { createSubscription, getAllSubscription };
