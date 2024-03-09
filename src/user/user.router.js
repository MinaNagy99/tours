import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  login,
  register
} from "./user.controller.js";
import { userSchemaCreate, userSchemaLogin } from "./user.validation.js";
import { allowedTo, auth } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";

const userRouter = Router();
userRouter.route("/register").post(validation(userSchemaCreate), register);
userRouter.route("/login").post(validation(userSchemaLogin), login);
userRouter.route("/").get(auth, allowedTo("admin"), getAllUsers);
userRouter.route("/:id").get(getUserById);

export default userRouter;
