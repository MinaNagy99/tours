import { Router } from "express";
import { auth, allowedTo } from "../../middlewares/auth.js";
import {
  clearSubscription,
  createSubscription,
  getAllSubscription,
  getSubscriptionById,
} from "./subscription.controller.js";
import { validation } from "../../middlewares/validation.js";
import { subscriptionSchema } from "./subscription.validation.js";
const subscriptionRouter = Router();
subscriptionRouter.route("/clear").get(clearSubscription);

subscriptionRouter
  .route("/:id")
  .post(auth, validation(subscriptionSchema), createSubscription)
  .get(auth, getSubscriptionById);
subscriptionRouter.route("/").get(auth, getAllSubscription);

export default subscriptionRouter;
