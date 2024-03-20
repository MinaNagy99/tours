import joi from "joi";

export const testimonialSchema = joi.object({
  userName: joi.string().min(2).max(30).required(),
  description: joi.string().min(2).max(1000).required(),
  rate: joi.number().min(1).max(5).required(),
  avatar: joi.any(),
  email: joi.string().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/)
});
export const testimonialUpdateSchema = joi.object({
  userName: joi.string().min(2).max(30),
  description: joi.string().min(2).max(1000),
  rate: joi.number().min(1).max(5),
  avatar: joi.any(),
  email: joi.string().pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/),
  id: joi.string().hex().length(24)
});
