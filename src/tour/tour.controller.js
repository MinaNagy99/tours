import tourModel from "../../DataBase/models/tourModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import { removeImage } from "../../middlewares/deleteImg.js";
import { AppError } from "../../utilities/AppError.js";

const createTour = catchAsyncError(async (req, res, next) => {
  const tour = await tourModel.create(req.body);

  !tour && next(new AppError("can't create tour"));
  res.status(200).send({ message: "success", data: tour });
});

const deleteTour = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const tour = await tourModel.findByIdAndDelete(id);

  !tour && next(new AppError("can't delete the tour"));

  console.log("delete tour");
  removeImage(tour.mainImg.Public_id);
  tour.images.forEach((img) => {
    removeImage(img.Public_id);
  });
  res.status(200).send({ message: "success" });
});

const updateTour = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const tour = await tourModel.findByIdAndUpdate(id, req.body);
  if (req.body.mainImg) {
    removeImage(tour.mainImg.Public_id);
  }
  if (req.body.images) {
    tour.images.forEach((img) => {
      removeImage(img.Public_id);
    });
  }
  !tour && next(new AppError("can't update the tour"));
  res.status(200).send({ message: "success" });
});

const getAllTour = catchAsyncError(async (req, res, next) => {
  const tours = await tourModel.find();
  !tours && next(new AppError("can't find any tour"));
  res.status(200).send({ message: "success", data: tours });
});
const getTourById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const tour = await tourModel.findById(id);
  if (!tour) {
    return next(new AppError("Can't find this tour", 404));
  }
  res.status(200).send({ message: "success", data: tour });
});

export { getAllTour, createTour, getTourById, deleteTour, updateTour };
