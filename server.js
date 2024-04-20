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
import Stripe from "stripe";
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
const endpointSecret = "we_1OvbUS1dg36NYh7MLUkDgymh";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.post(
  "/payment/handelPassCheckout",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log('payment sucessss');
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
app.use(customErrorHandler);
app.listen(process.env.PORT || 3000, (req, res, next) => {
  console.log("server is running");
});
