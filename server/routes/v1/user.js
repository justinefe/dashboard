import express from "express";
import "express-async-errors";
import {
  login,
  signup,
  resetPassword,
  changePassword,
  updateUser,
  confirmEmail,
} from "../../controllers/user";
import middlewares from "../../middlewares";

const {
  validate,
  loginSchema,
  signUpSchema,
  confirmEmailSchema,
  changePasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  checkInvitation,
} = middlewares;

const userRoutes = express();

userRoutes.post(
  "/reset_password_link",
  validate(resetPasswordSchema),
  resetPassword
);
userRoutes.put(
  "/change_password/:resetToken",
  validate(
    changePasswordSchema,
    (req) => (req.body.resetToken = req.params.resetToken)
  ),
  changePassword
);

userRoutes.post(
  "/confirm_email/:emailToken",
  validate(
    confirmEmailSchema,
    (req) => (req.body.emailToken = req.params.emailToken)
  ),
  confirmEmail
);

userRoutes.post("/login", validate(loginSchema), login);
userRoutes.post("/signup", validate(signUpSchema), signup);
userRoutes.patch("/update", validate(updateUserSchema), updateUser);

export default userRoutes;
