import express from "express";
import { auth } from "../../middlewares/auth.js";
import {
  fwaterk,
  handleSuccessPayment,
  sessionCheckout,
} from "./payment.controller.js";
const paymentRouter = express.Router();

paymentRouter.post("/checkout-session/:id", auth, fwaterk);
paymentRouter.get("/handelPassCheckout/:token", handleSuccessPayment);
// paymentRouter.post("/fwaterk/:id", auth, fwaterk);
export default paymentRouter;
