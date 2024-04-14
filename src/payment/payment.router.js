import express from "express";
import { auth } from "../../middlewares/auth.js";
import {
  handleSuccessPayment,
  sessionCheckout,
  webhook,
} from "./payment.controller.js";
const paymentRouter = express.Router();

paymentRouter.post("/checkout-session/:id", auth, sessionCheckout);
paymentRouter.post("/webhook", webhook); // Endpoint to receive webhook events from Stripe
paymentRouter.get("/success", handleSuccessPayment); // Route to handle successful payment
export default paymentRouter;
