import categoryModel from "../../DataBase/models/categoryModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import { AppError } from "../../utilities/AppError.js";

const createCategory = catchAsyncError(async (req, res, next) => {
  const category = new categoryModel(req.body);
  await category.save();
  res.status(200).send({ message: "success", data: category });
});

const deleteCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const result = await categoryModel.findByIdAndDelete(id);
  if (!result) {
    return next(new AppError("can't delete the category", 400));
  }
  res.status(200).send({ message: "success" });
});

const getAllCategory = catchAsyncError(async (req, res, next) => {
  const categories = await categoryModel.find();
  if (!categories) {
    return next(new AppError("can't find any category", 400));
  }
  res.status(200).send({ message: "success", data: categories });
});

export { getAllCategory, deleteCategory, createCategory };
