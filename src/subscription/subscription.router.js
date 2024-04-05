import { Router } from "express";
import { auth, allowedTo } from "../../middlewares/auth.js";
import {
  createSubscription,
  getAllSubscription
} from "./subscription.controller.js";
import { validation } from "../../middlewares/validation.js";
import { subscriptionSchema } from "./subscription.validation.js";
const subscriptionRouter = Router();

subscriptionRouter
  .route("/:id")
  .post(auth, validation(subscriptionSchema), createSubscription);
subscriptionRouter.route("/").get(auth, allowedTo("admin"), getAllSubscription);

export default subscriptionRouter;
