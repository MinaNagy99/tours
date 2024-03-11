import joi from "joi";

const userSchemaLogin = joi.object({
  email: joi
    .string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/)
    .required(),
  password: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)
    .required()
});
const userSchemaCreate = joi.object({
  name: joi.string().min(2).max(15).required(),
  email: joi
    .string()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/)
    .required(),
  password: joi
    .string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)
    .required(),
  rePassword: joi.ref("password"),
  avatar: joi.any(),
  age: joi.number(),
  nationality: joi.string(),
  phone: joi.number()
});

export { userSchemaCreate, userSchemaLogin };
