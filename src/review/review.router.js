import { Router } from "express";
import { auth } from "../../middlewares/auth.js";

import {
  createReview,
  deleteReview,
  editReview,
  getAllReviews,
} from "./review.controller.js";
const reviewRouter = Router();

reviewRouter
  .route("/:id")
  .post(auth, createReview)
  .patch(auth, editReview)
  .delete(auth, deleteReview)
  .get(getAllReviews);

export default reviewRouter;
