import express from "express";
import { auth } from "../../middlewares/auth.js";
import {
  handleSuccessPayment,
  sessionCheckout,
  webhook,
} from "./payment.controller.js";
const paymentRouter = express.Router();

paymentRouter.post("/checkout-session/:id", auth, sessionCheckout);
const endpointSecret = "whsec_64b5c867d3b96e114b75383c4acf09c6cecb6783df7dca01604618bcdd202e97";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
export default paymentRouter;
