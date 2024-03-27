import { hash } from "bcrypt";
import userModel from "../../DataBase/models/userModel.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import { removeImage } from "../../middlewares/deleteImg.js";
import { AppError } from "../../utilities/AppError.js";
import sendEmail from "../../utilities/Emails/sendEmail.js"
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
  console.log("dddddd");
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
const authentication = catchAsyncError(async (req, res, next) => {
  console.log("from Authentication");
  res
    .status(200)
    .send({ message: "success", data: "Authentication successful" });
});
const authorization = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  role == "user" && res.status(200).send({ message: "success", role: "user" });
  role == "admin" &&
    res.status(200).send({ message: "success", role: "admin" });
});
const sendCode = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const randomCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  const code = randomCode.toString();
  await userModel.findOneAndUpdate({ email: email }, { code });
  sendEmail({ email, code });
  res.status(200).send({ message: "success" });
});

const checkCode = catchAsyncError(async (req, res, next) => {
  const { code, email } = req.body;
  const result = await userModel.findOne({ email, code });
  if (!result) {
    return next(new AppError("correct email or code"));
  }
  res.status(200).send({ message: "success", data: "correct code" });
});
const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email, code, newPassword } = req.body;

  // Check if the provided email and code exist in the database
  const user = await userModel.findOneAndUpdate(
    { email, code },
    { password: await hash(newPassword, 10), $unset: { code: "" } }
  );
  if (!user) {
    return next(new AppError("Invalid email or code", 400));
  }

  res.status(200).send({ message: "Password reset successfully" });
});

const changePassword = catchAsyncError(async (req, res, next) => {
  const { newPassword, password } = req.body;
  const { _id } = req.user;
  const user = await userModel.findByIdAndUpdate(_id);
  if (!(await user.comparePassword(password))) {
    return next(new AppError("incorrect password"));
  }
  await userModel.findByIdAndUpdate(_id, {
    password: await hash(newPassword, 10)
  });
  res.status(200).send({ message: "success", data: "password changed" });
});

export {
  login,
  register,
  updateUserProfile,
  getUserById,
  getAllUsers,
  addToWishList,
  removeFromWishList,
  changePassword,
  sendCode,
  checkCode,
  forgetPassword,
  authentication,
  authorization
};
