import express from "express";
import { auth } from "../../middlewares/auth.js";
import { handleSuccessPayment, sessionCheckout } from "./payment.controller.js";
const paymentRouter = express.Router();

paymentRouter.post("/checkout-session", auth, sessionCheckout);
paymentRouter.get('/success', handleSuccessPayment);
paymentRouter.post('/webhook', );
export default paymentRouter;
