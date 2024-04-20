import express from "express";
import { auth } from "../../middlewares/auth.js";
import { handleSuccessPayment, sessionCheckout } from "./payment.controller.js";
const paymentRouter = express.Router();

paymentRouter.post("/checkout-session/:id", auth, sessionCheckout);
paymentRouter.get("/handelPassCheckout/:token", handleSuccessPayment);
export default paymentRouter;
