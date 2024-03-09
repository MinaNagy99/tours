import express from "express";
import DbConnection from "./DataBase/DbConnection.js";
import morgan from "morgan";
import cors from "cors";
import customErrorHandler from "./middlewares/customErrorHandler.js";
import dotenv from "dotenv";
import userRouter from "./src/user/user.router.js";
import tourRouter from "./src/tour/tour.router.js";
const app = express();

DbConnection;
app.use(cors());
dotenv.config();

app.use(morgan("combined"));
app.use(express.json());
app.use("/user", userRouter);
app.use("/tour", tourRouter);

app.use(customErrorHandler);
app.listen(process.env.PORT || 3000, (req, res, next) => {
  console.log("server is running");
});