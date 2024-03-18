import { Router } from "express";
import { auth, allowedTo } from "../../middlewares/auth.js";
import {
  createSubscription,
  getAllSubscription
} from "./subscription.controller.js";
const subscriptionRouter = Router();

subscriptionRouter.route("/:id").post(auth, createSubscription);
subscriptionRouter.route("/").get(auth, allowedTo("admin"), getAllSubscription);

export default subscriptionRouter;
