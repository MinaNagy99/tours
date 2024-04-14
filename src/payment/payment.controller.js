import stripe from "stripe";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import { AppError } from "../../utilities/AppError.js";
import subscriptionModel from "../../DataBase/models/subscriptionModel.js";
import { text } from "express";

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const sessionCheckout = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;
  const subscription = await subscriptionModel.findOne({
    _id: id,
    userDetails: _id,
  });

  if (subscription) {
    const { options, adultPricing, childrenPricing } = subscription;

    let line_items = [];
    line_items.push({
      price_data: {
        currency: "USD",
        unit_amount: adultPricing.totalPrice * 100,
        product_data: {
          name: `Adult`,
          images: ["https://cdn-icons-png.freepik.com/512/3787/3787951.png"],
        },
      },
      quantity: adultPricing.adults,
    });
    if (childrenPricing) {
      line_items.push({
        price_data: {
          currency: "USD",
          unit_amount: childrenPricing.totalPrice * 100,
          product_data: {
            name: "Child",
            images: [
              "https://toppng.com/uploads/preview/children-icon-png-11552333579xtroc64zmd.png",
            ],
          },
        },
        quantity: childrenPricing.children,
      });
    }
    if (options) {
      options.forEach((option) => {
        line_items.push({
          price_data: {
            currency: "USD",
            unit_amount: option.totalPrice * 100,
            product_data: {
              name: option.name,
              images: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjIieaF9GiSBIqCSzhrBCyzLELknPW4SLziBBZ5yXuAw&s",
              ],
            },
          },
          quantity: 1,
        });
      });
    }

    let stripeSession = await stripeInstance.checkout.sessions.create({
      line_items,
      metadata: {
        subscriptionId: req.params.id,
      },
      mode: "payment",

      // success_url: `bashmohands.onrender.com/api/pay/success?uniqueIdentifier=${uniqueIdentifier}`,
      success_url: `https://tours-b5zy.onrender.com/payment/handelPassCheckout`,
      cancel_url: "https://www.yahoo.com/?guccounter=1",
    });

    if (!stripeSession)
      return next(new AppError("Payment Failed, please try again!", 500));

    res.json({ redirectTo: stripeSession.url, data: stripeSession });
  } else {
    next(new AppError("can't find the subscription"));
  }
});

export const handleSuccessPayment = catchAsyncError(async (req, res, next) => {
  console.log(`from handle success payment: ${req.subscriptionId}`);
  const subscription = await subscriptionModel.findByIdAndUpdate(
    req.subscriptionId,
    {
      payment: "success",
    }
  );
  res.status(200).send({
    message: "success",
    data: { message: "subscriptionId", data: subscription },
  });
});

export const webhook = catchAsyncError(async (req, res, next) => {
  try {
    const event = req.body; // Assuming Stripe sends the webhook payload in the request body
    console.log("Received event:", event);

    // Process event based on its type
    switch (event.type) {
      case "checkout.session.async_payment_succeeded":
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        console.log(
          `from webhook this is checkoutSessionAsync : ${checkoutSessionAsyncPaymentSucceeded}`
        );

        // Extract metadata from the event
        const metadata = checkoutSessionAsyncPaymentSucceeded.metadata;
        console.log(`from webhook this is metadata : ${metadata}`);

        // Set the subscription ID in the request object to be used later
        req.subscriptionId = metadata.subscriptionId;
        break;
      // Handle other event types if needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    next();
  } catch (err) {
    // Return an error response if the signature is invalid or the event is malformed
    console.error("Error verifying webhook signature:", err.message);
    return res.sendStatus(400);
  }
});

export const handelPassCheckout = catchAsyncError(async (req, res) => {
  // Your webhook handling logic here

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = await stripe.webhooks.constructEvent(
      req.body,
      sig,
      "whsec_gAiAQSM4GkVKasyfasQu6voR0miuHo2r"
    );
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.async_payment_succeeded":
      const session = event.data.object;
      // Handle successful payment
      console.log("Payment succeeded:", session);
      break;
    // Add more cases to handle other types of events as needed
    default:
      // Unexpected event type
      console.warn(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});
