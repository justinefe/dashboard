import Joi from "@hapi/joi";

export const signUpSchema = Joi.object().keys({
  role: Joi.string().trim().required(),
  totalUser: Joi.number().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().required(),
  password: Joi.string().min(8).required(),
  inviteToken: Joi.string().trim().optional(),
});

export const updateUserSchema = Joi.object().keys({
  firstName: Joi.string()
    .regex(/^[A-Za-z]{2,}$/)
    .trim(),
  lastName: Joi.string()
    .regex(/^[A-Za-z]{2,}$/)
    .trim(),
  userName: Joi.string().lowercase(),
  bio: Joi.string(),
  emailNotify: Joi.boolean(),
  inAppNotify: Joi.boolean(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim(),
});

export const changePasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  resetToken: Joi.string(),
});

export const confirmEmailSchema = Joi.object({
  emailToken: Joi.string(),
});
