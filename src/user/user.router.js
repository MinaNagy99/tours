import { Router } from "express";
import {
  addToWishList,
  authentication,
  authorization,
  changePassword,
  checkCode,
  forgetPassword,
  getAllUsers,
  getUserById,
  login,
  register,
  removeFromWishList,
  sendCode
} from "./user.controller.js";
import { forgetPasswordSchema, userSchemaLogin } from "./user.validation.js";
import { allowedTo, auth } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import { uploadMixfile } from "../../middlewares/fileUpload.js";
import { saveImg } from "../../middlewares/uploadToCloud.js";

const userRouter = Router();
userRouter
  .route("/register")
  .post(uploadMixfile([{ name: "avatar", maxCount: 1 }]), saveImg, register);
userRouter.route("/login").post(validation(userSchemaLogin), login);
userRouter.route("/").get(auth, allowedTo("admin"), getAllUsers);
userRouter.route("/authentication").get(auth, authentication);
userRouter.route("/authorization").get(auth, authorization);
userRouter.route("/:id").get(getUserById);
userRouter.route("/addToWishlist/:id").patch(auth, addToWishList);
userRouter.route("/removeWishlist/:id").patch(auth, removeFromWishList);
userRouter.route("/changePassword").patch(auth, changePassword);
userRouter.route("/sendCode").put(sendCode);
userRouter.route("/checkCode").put(checkCode);
userRouter
  .route("/forgetPassword")
  .patch(validation(forgetPasswordSchema), forgetPassword);

export default userRouter;
