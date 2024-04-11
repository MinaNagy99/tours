import subscriptionModel from "../../DataBase/models/subscriptionModel.js";
import tourModel from "../../DataBase/models/tourModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import { ApiFeature } from "../../utilities/AppFeature.js";
import { ObjectId } from "mongodb";

const createSubscription = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;

  try {
    const tour = await tourModel.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    let { adultPricing, childrenPricing, options } = req.body;
    req.body.userDetails = _id;
    req.body.tourDetails = id;

    let fetchingOptions = await tourModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $unwind: "$options" },
      {
        $match: {
          "options._id": {
            $in: options.map((option) => new ObjectId(option.id)),
          },
        },
      },
      { $project: { options: 1 } },
      {
        $replaceRoot: { newRoot: "$options" },
      },
    ]);

    let fetchingChildren = await tourModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $unwind: "$childrenPricing" },
      {
        $match: { "childrenPricing._id": new ObjectId(childrenPricing) },
      },
      { $project: { childrenPricing: 1, _id: 0 } },
      { $replaceRoot: { newRoot: "$childrenPricing" } },
    ]);

    let fetchingAdult = await tourModel.aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $unwind: "$adultPricing" },
      {
        $match: { "adultPricing._id": new ObjectId(adultPricing) },
      },
      { $project: { adultPricing: 1, _id: 0 } },
      { $replaceRoot: { newRoot: "$adultPricing" } },
    ]);

    let totalPrice = 0;
    totalPrice = fetchingAdult[0].totalPrice + fetchingChildren[0].totalPrice;
    fetchingOptions.forEach((option) => {
      options.forEach((inputOption) => {
        if (option._id == inputOption.id) {
          option.number = inputOption.number;
          option.numberOfChildern = inputOption.numberOfChildern;
          option.totalPrice =
            option.childPrice * option.numberOfChildern +
            option.price * option.number;
          totalPrice += option.totalPrice;
        }
      });
    });
    req.body.options = fetchingOptions;
    req.body.adultPricing = fetchingAdult[0];
    req.body.childrenPricing = fetchingChildren[0];
    req.body.totalPrice = totalPrice;

    const resultOfSubscription = new subscriptionModel(req.body);
    await resultOfSubscription.save();
    res.status(200).json({
      message: "Subscription created successfully",
      data: resultOfSubscription,
    });
  } catch (error) {
    // Handle errors here
    console.error("Error in createSubscription:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getAllSubscription = catchAsyncError(async (req, res, next) => {
  const { role, _id } = req.user;
  if (role == "user") {
    const apiFeature = new ApiFeature(
      subscriptionModel.find({ userDetails: _id }),
      req.query
    )
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
  }
  if (role == "admin") {
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
  }
});

export { createSubscription, getAllSubscription };
