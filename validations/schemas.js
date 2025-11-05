const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().trim(),
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'admin').required(),
});


const loginSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().required(),
});

const reportSchema = Joi.object({
  date: Joi.date().required().max("now"),
  tasks: Joi.string().min(10).max(1000).required().trim(),
  timings: Joi.string().min(5).max(100).required().trim(),
  notes: Joi.string().max(500).optional().allow("").trim(),
});

module.exports = {
  registerSchema,
  loginSchema,
  reportSchema,
};
