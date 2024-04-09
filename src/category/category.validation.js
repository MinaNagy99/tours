import Joi from "joi";
export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required()
});

export const deleteCategorySchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});
