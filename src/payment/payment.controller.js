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
  try {
    // const sessionId = req.query.session_id;
    console.log(req);
    res.send({ message: "success" });

    // res.json({
    //   message: 'Payment successful',
    //   instructorHandler,
    //   clientHandler,
    //   date,
    //   notes,
    //   token,
    // });

    // const bookSessionUrl = "http://localhost:5000/api/session/book";
    // const bookSessionUrl = 'bashmohands.onrender.com/api/session/book';

    // const response = axios.post(
    //   bookSessionUrl,
    //   {
    //     instructorHandler,
    //     clientHandler,
    //     date,
    //     topics: ["Js"],
    //     notes
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Content-Type": "application/json"
    //     }
    //   }
    // );

    // console.log(response.data);

    // Response(res, "Session Booked Successfuuly.", 200);
  } catch (error) {
    console.log("Error in /success route:", error);
    res.status(500).json({ error });
  }
});

export const webhook = catchAsyncError((req, res) => {
  console.log('webhook with stip');
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, 'your_webhook_secret');
    // Handle the event
    console.log('Received event:', event.type);
    
    // Process event based on its type
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Handle successful payment
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        // Handle failed payment
        break;
      // Handle other event types as needed
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Respond with a 2xx status to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err) {
    // Return an error response if the signature is invalid or the event is malformed
    console.error('Error verifying webhook signature:', err.message);
    return res.sendStatus(400);
  }
}) 
