import stripe from "stripe";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import { AppError } from "../../utilities/AppError.js";

const stripeInstance = stripe(
  "sk_test_51OuXAh1dg36NYh7MM3PBMH6wiDcabjaml5KopcnrfwsZJgk4haRfF0B5ZsRAI8Aj35R6oZQrAuqp5oFXpa2vovxV00XmL4qnL1"
);

export const sessionCheckout = catchAsyncError(async (req, res, next) => {
  const totalPrice = 500;
  const userName = "mina nagy";

  let stripeSession = await stripeInstance.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalPrice * 100,
          product_data: {
            name: userName
          }
        },
        quantity: 1
      }
    ],
    mode: "payment",
    // success_url: `bashmohands.onrender.com/api/pay/success?uniqueIdentifier=${uniqueIdentifier}`,
    success_url: `https://tours-b5zy.onrender.com/payment/success`,
    cancel_url: "https://www.yahoo.com/?guccounter=1"
  });

  if (!stripeSession)
    return next(new AppError("Payment Failed, please try again!", 500));

  res.json({ redirectTo: stripeSession.url });
});

export const handleSuccessPayment = catchAsyncError(async (req, res, next) => {
  res.status(200).send({message:"success",data:"checkout is done"})
});

export const webhook = catchAsyncError(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = await stripe.webhooks.constructEvent(
      req.body,
      sig,
      "your_webhook_secret"
    );
    // Handle the event
    console.log("Received event:", event.type);

    // Process event based on its type
    switch (event.type) {
      case "checkout.session.async_payment_succeeded":
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Respond with a 2xx status to acknowledge receipt of the event
    next();
  } catch (err) {
    // Return an error response if the signature is invalid or the event is malformed
    console.error("Error verifying webhook signature:", err.message);
    return res.sendStatus(400);
  }
});
