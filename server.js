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
import categoryRouter from "./src/category/category.router.js";
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
app.use("/category", categoryRouter);

app.use(customErrorHandler);
app.listen(process.env.PORT || 3000, (req, res, next) => {
  console.log("server is running");
});
