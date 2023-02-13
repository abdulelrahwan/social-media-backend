import Joi from "joi";

// Register Api validator
export const RegisterValidator = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

// Login Api validator
export const LoginValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
// Pagination Api validator
export const paginationValidator = Joi.object({
  page: Joi.number().min(1).required(),
});
