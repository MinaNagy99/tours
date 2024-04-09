import { Router } from "express";
import { validation } from "../../middlewares/validation.js";
import {
  createCategory,
  deleteCategory,
  getAllCategory
} from "./category.controller.js";
import {
  createCategorySchema,
  deleteCategorySchema
} from "./category.validation.js";

const categoryRouter = Router();

categoryRouter
  .route("/")
  .get(getAllCategory)
  .post(validation(createCategorySchema), createCategory);
categoryRouter
  .route("/:id")
  .delete(validation(deleteCategorySchema), deleteCategory);

export default categoryRouter;
