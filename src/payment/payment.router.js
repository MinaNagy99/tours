import express from "express";
import { auth } from "../../middlewares/auth.js";
import {
  handelPassCheckout,
  handleSuccessPayment,
  sessionCheckout,
} from "./payment.controller.js";
const paymentRouter = express.Router();

paymentRouter.post("/checkout-session/:id", auth, sessionCheckout);
paymentRouter.post("/handelPassCheckout", handelPassCheckout);
paymentRouter.get("/success", handleSuccessPayment);
export default paymentRouter;
