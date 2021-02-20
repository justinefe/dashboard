// import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { encryptQuery } from "./Utilities";
// import models from "../database/models";

dotenv.config();

// export const generateInviteToken = async ({ orgId, expired }) => {
//   const activationCode = crypto.randomBytes(32).toString("hex");
//   const token = encryptQuery(
//     JSON.stringify({ activationCode, organizationId: orgId })
//   );

//   const elapsedTime = expired ? -86400000 : 86400000; // 24hrs
//   await models.Token.create({
//     activationCode,
//     organizationId: orgId,
//     token,
//     expiredAt: new Date(Date.now() + elapsedTime).toISOString(), // expire in the next 24hrs
//   });
//   return token;
// };

// const validateInviteToken = async ({ activationCode, organizationId }) => {
//   const foundToken = await models.Token.findOne({
//     where: {
//       activationCode,
//       organizationId,
//     },
//   });

//   if (!foundToken) {
//     return { error: "Operation Failed. Token does not exist" };
//   }

//   const expiredTime = new Date(foundToken.expiredAt);
//   const now = new Date();

//   if (expiredTime < now) {
//     await foundToken.destroy(); // remove token
//     return {
//       error:
//         "Invitation link has expired. please contact the organization owner.",
//     };
//   }
//   await foundToken.destroy();
//   return { message: "Operation was successful" };
// };

// export const checkOrgMembership = async ({ organizationId, userId }) => {
//   const asOwner = await models.Organization.findOne({
//     where: {
//       id: organizationId,
//       ownerId: userId,
//     },
//   });

//   if (asOwner) {
//     return {
//       error: "You cannot be invited to join since you are already the owner",
//     };
//   }

//   const asStaff = await models.Staff.findOne({
//     where: {
//       organizationId,
//       userId,
//     },
//   });

//   if (asStaff) {
//     return {
//       error: "You cannot be invited to join since you are already a staff",
//     };
//   }

//   return {};
// };

// export const joinOrgMethod = async ({
//   organizationId,
//   userId,
//   activationCode,
// }) => {
//   const { error, message } = await validateInviteToken({
//     organizationId,
//     activationCode,
//   });

//   if (error) {
//     return { error };
//   }

//   const staff = await models.Staff.create({
//     organizationId: organizationId,
//     userId,
//   });

//   return { error, message, staff };
// };

const secretKey = process.env.APP_SECRET;
export const createToken = (payload) =>
  jwt.sign(payload, secretKey, {
    expiresIn: "1d",
  });

export const verifyToken = (tokenString) =>
  jwt.verify(tokenString, secretKey, (err, data) => {
    if (err) return false;
    return data;
  });
