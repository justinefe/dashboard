import crypto from "crypto";
import Sequelize from "sequelize";
import models from "../database/models";
import helpers from "../helpers";
import { createToken } from "../helpers/inviteToken";
// import sendEmail from '../services/email';
import { emailSender } from "../services/email";
import { resetPasswordMessage, activationMessage } from "../services";
import dbRepository from "../helpers/dbRepository";

const userRepository = new dbRepository(models.User);

const { successStat, errorStat, comparePassword } = helpers;

const { Op } = Sequelize;

/**
 * / @static
 * @description Allows a user to sign in
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const login = async (req, res) => {
  const { email, password } = req.body.user;
  const user = await models.User.findOne({ where: { email } });

  if (!user) return errorStat(res, 401, "Incorrect Login information");

  const matchPasswords = comparePassword(password, user.password);

  if (!matchPasswords) {
    return errorStat(res, 401, "Incorrect Login information");
  }
  const token = createToken({
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    role: user.role,
  });
  // await req.session.login(user.role, { user: user.dataValues }, res);
  const message = "Login successful";

  return successStat(res, 200, "user", {
    ...user.userResponse(),
    ...token,
    message,
  });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const signup = async (req, res) => {
  const { firstName, lastName, email, userName, password } = req.body.user;
  const isExist = await models.User.findOne({ where: { email } });

  if (isExist) return errorStat(res, 409, "User Already Exist");

  const isUserName = await models.User.findOne({ where: { userName } });

  if (isUserName) return errorStat(res, 409, "UserName Already Exist");

  const emailToken = crypto.randomBytes(64).toString("hex");

  const date = new Date().setMinutes(40);

  const user = await models.User.create({
    firstName,
    lastName,
    email,
    password,
    role: "user",
    userName,
    emailVerification: emailToken,
    expiredAt: date,
  });
  const token = createToken({
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    role: user.role,
  });
  const link = `${req.protocol}/${req.headers.host}/api/v1/user/confirm_email/:${emailToken}`;
  /*
  Message body to send mail
  */
  const verifyMessage = {
    from: '"Paxinfy 👻" <paxinfy@gmail.com>', // sender address
    bcc: `${email}`,
    subject: "Verify your message",
    html: activationMessage(user, link),
  };
  await emailSender(verifyMessage);

  await req.session.login(user.role, { user: user.dataValues }, res);
  const message = "Registration is successful";

  return successStat(res, 201, "user", {
    ...user.userResponse(),
    ...token,
    message,
  });
};

/**
 * @static
 * @description Update user profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data
 * @memberof UserController
 */
export const updateUser = async (req, res) => {
  const { firstName, lastName, userName, bio } = req.body.user;

  if (!req.session.user) {
    return errorStat(res, 403, "Unauthorize Access. Please login.");
  }

  const { id } = req.session.user;

  const user = await models.User.findOne({
    where: { id },
  });

  if (userName) {
    const isUser = await models.User.findOne({
      where: { userName },
    });
    if (isUser) {
      if (isUser.id !== user.id) {
        return errorStat(res, 409, "Username already exist");
      }
    }
  }

  await user.update({
    userName: userName || user.userName,
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    bio: bio || user.bio,
    inAppNotify: req.body.inAppNotify || user.inAppNotify,
    emailNotify: req.body.emailNotify || user.emailNotify,
  });

  return successStat(res, 200, "user", { ...user.userResponse() });
};

/**
 * @description Allows a user to resend password link
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */

/**
 * @description It sends confirmatory messages to users
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */

export const confirmEmail = async (req, res) => {
  const { emailToken } = req.body.user;

  const condition = {
    emailVerification: emailToken,
    activated: false,
  };

  const findUser = await userRepository.getOne(condition);

  if (findUser) {
    await userRepository.updateOne(
      { emailVerification: null, activated: true },
      { emailVerification: emailToken }
    );

    return successStat(
      res,
      200,
      "Message",
      "Your account has been activated succesfully"
    );
  }
  return errorStat(res, 400, "Invalid activation link");
};

/**
 * @description Allows a user to resend password link
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */

export const resetPassword = async (req, res) => {
  const { email } = req.body.user;

  const findUser = await userRepository.getOne({ email });

  if (!findUser) return errorStat(res, 404, "User does not exist");

  const resetToken = crypto.randomBytes(64).toString("hex");
  const date = new Date().setMinutes(40);

  await userRepository.updateOne(
    { resetPasswordVerification: resetToken, expiredAt: date },
    { email }
  );

  // const link = `${req.protocol}//${req.headers.host}/api/v1/user/change_password/:${resetToken}`;
  // const link = `${process.env.APP_URL}/api/v1/user/change_password/:${resetToken}`;

  const link = `${req.protocol}//localhost:3000/change_password/${resetToken}`;
  const message = {
    from: '"Paxinfy 👻" <paxinfy@gmail.com>', // sender address
    bcc: `${email}`,
    subject: "Reset Password Link",
    html: resetPasswordMessage(findUser, link),
  };
  await emailSender(message);

  return successStat(
    res,
    200,
    "Message",
    "Resent passord link has been sent to your email, clik link to activate your account"
  );
};

/**
 * @static
 * @description Allows a user to change password
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */

export const changePassword = async (req, res) => {
  const { password, resetToken } = req.body.user;

  const condition = {
    resetPasswordVerification: resetToken,
    expiredAt: { [Op.gt]: new Date() },
  };

  const findUser = await userRepository.getOne(condition);

  if (!findUser) return errorStat(res, 401, "Password reset unsuccesful");

  await userRepository.updateOne(
    {
      password,
      resetPasswordVerification: null,
      expiredAt: null,
    },
    { resetPasswordVerification: resetToken }
  );

  return successStat(res, 200, "Message", "Your password has been changed");
};
