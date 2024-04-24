import { Router } from "express";
import { auth } from "../../middlewares/auth.js";

import {
  createReview,
  deleteReview,
  editReview,
  getAllReviews,
} from "./review.controller.js";
import { validation } from "../../middlewares/validation.js";
import {
  ReviewSchmea,
  createReviewSchema,
  editReviewSchmea,
} from "./review.validation.js";
const reviewRouter = Router();

reviewRouter
  .route("/:id")
  .post(auth, validation(createReviewSchema), createReview)
  .patch(auth, validation(editReviewSchmea), editReview)
  .delete(auth, validation(ReviewSchmea), deleteReview)
  .get(validation(ReviewSchmea), getAllReviews);

export default reviewRouter;
