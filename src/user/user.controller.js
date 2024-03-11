import userModel from "../../DataBase/models/userModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import { removeImage } from "../../middlewares/deleteImg.js";
import { AppError } from "../../utilities/AppError.js";

const register = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const oldUser = await userModel.findOne({ email });
  if (oldUser) return next(new AppError("user already exists", 400));
  const user = new userModel(req.body);
  await user.save();
  const token = await user.generateToken();
  res.status(200).send({ message: "success", data: user, token });
});
const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await userModel.find();
  !users && new AppError("can't find users");
  res.status(200).send({ message: "success", data: users });
});

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError("user not found", 400));
  if (!(await user.comparePassword(password))) {
    return next(new AppError("incorrect email or password"));
  }
  const token = await user.generateToken();
  res.status(200).send({ message: "success", data: user, token });
});

const getUserById = catchAsyncError(async (req, res, next) => {
  console.log("ddd");
  const { id } = req.params;
  const user = await userModel.findById(id);
  !user && next(new AppError("can't find the user"));
  res.status(200).send({ message: "success", data: user });
});

const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = await userModel.findByIdAndUpdate(_id, req.body);
  removeImage(avatar.public_id);
  res.status(200).send({ message: "success" });
});

const addToWishList = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(
    _id,
    {
      $addToSet: { wishList: id } // Corrected field name to wishList
    },
    { new: true }
  );
  !user && next(new AppError("can't find the tour"));
  res.status(200).send({ message: "success", data: user });
});

const removeFromWishList = catchAsyncError(async (req, res, next) => {
  const { _id } = req.user;
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(
    _id,
    {
      $pull: { wishList: id }
    },
    { new: true }
  );
  !user && next(new AppError("can't find the tour"));
  res.status(200).send({ message: "success", data: user });
});

export {
  login,
  register,
  updateUserProfile,
  getUserById,
  getAllUsers,
  addToWishList,
  removeFromWishList
};
