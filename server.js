import express from "express";
import DbConnection from "./DataBase/DbConnection.js";
import morgan from "morgan";
import cors from "cors";
import customErrorHandler from "./middlewares/customErrorHandler.js";
import dotenv from "dotenv";
import userRouter from "./src/user/user.router.js";
import tourRouter from "./src/tour/tour.router.js";
import subscriptionRouter from "./src/subscription/subscription.router.js";
import paymentRouter from "./src/payment/payment.router.js";
import testimonialRouter from "./src/testimonial/testimonial.router.js";
const app = express();

DbConnection;
app.use(cors());
dotenv.config();

app.use(morgan("combined"));
app.use(express.json());
app.use("/user", userRouter);
app.use("/tour", tourRouter);
app.use("/payment", paymentRouter);
app.use("/subscription", subscriptionRouter);
app.use("/testimonial", testimonialRouter);
app.post("/webhook", (req, res) => {
  const event = req.body;
  console.log("event form /webhook", event);
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
});
app.use(customErrorHandler);
app.listen(process.env.PORT || 3000, (req, res, next) => {
  console.log("server is running");
});
