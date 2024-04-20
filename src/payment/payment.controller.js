import stripe from "stripe";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";
import { AppError } from "../../utilities/AppError.js";
import subscriptionModel from "../../DataBase/models/subscriptionModel.js";
import jwt from "jsonwebtoken";

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const sessionCheckout = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { _id } = req.user;
  let subscription = await subscriptionModel.findOne({
    _id: id,
    userDetails: _id,
  });

  if (subscription.payment == "success") {
    return next(new AppError("The subscription has been paid"));
  }
  if (subscription) {
    let { options, adultPricing, childrenPricing } = subscription;
    console.log(childrenPricing);
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
    if (childrenPricing.totalPrice > 0) {
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
    const token = await jwt.sign(
      { subscriptionId: req.params.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    let stripeSession = await stripeInstance.checkout.sessions.create({
      line_items,

      metadata: {
        subscriptionId: req.params.id,
      },
      mode: "payment",
      customer_email: req.user.email,
      success_url: `https://tours-b5zy.onrender.com/payment/handelPassCheckout/${token}`,
      cancel_url: "https://www.yahoo.com/?guccounter=1",
    });

    if (!stripeSession)
      return next(new AppError("Payment Failed, please try again!", 500));

    res.json({ redirectTo: stripeSession.url, data: subscription });
  } else {
    next(new AppError("can't find the subscription"));
  }
});

export const handleSuccessPayment = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
    if (err) return next(new AppError(err.message));

    const { subscriptionId } = decoded;
    const subscription = await subscriptionModel.findByIdAndUpdate(
      {
        _id: subscriptionId,
      },
      { payment: "success" },
      { new: true }
    );
    res
      .status(200)
      .send({ message: "payment successfully", data: subscription });
  });
});
