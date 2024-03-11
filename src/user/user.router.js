import { Router } from "express";
import {
  addToWishList,
  getAllUsers,
  getUserById,
  login,
  register,
  removeFromWishList
} from "./user.controller.js";
import { userSchemaCreate, userSchemaLogin } from "./user.validation.js";
import { allowedTo, auth } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import {
  uploadMixfile,
  uploadSingleFile
} from "../../middlewares/fileUpload.js";
import { saveImg } from "../../middlewares/uploadToCloud.js";

const userRouter = Router();
userRouter
  .route("/register")
  .post(uploadMixfile([{ name: "avatar", maxCount: 1 }]), saveImg, register);
userRouter.route("/login").post(validation(userSchemaLogin), login);
userRouter.route("/").get(auth, allowedTo("admin"), getAllUsers);
userRouter.route("/:id").get(getUserById);
userRouter.route("/addToWishlist/:id").patch(auth, addToWishList);
userRouter.route("/removeWishlist/:id").patch(auth, removeFromWishList);

export default userRouter;
