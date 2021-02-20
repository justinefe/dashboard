import sgMail from '@sendgrid/mail';
import nodeMailer from 'nodemailer';
import '@babel/polyfill';
import dotenv from 'dotenv';
import { nodeMailerUsername, nodeMailerPassword } from '../config/envVariables';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/**
 * @name sendEmail
 * @async
 * @description function for sending emails to users
 * @param {String} receiver email of the receipient
 * @param {String} subject subject of email to be sent
 * @param {String} content content text to be sent to user
 * @return {objects} return true for successful email sending or error on failure
 */
export const sendEmail = async (receiver, subject, content) => {
  const data = {
    to: receiver,
    from: 'verify@paxinfy.com',
    subject,
    html: content,
    sandbox_mode: {
      enable: true
    }
  };
  try {
    return await sgMail.send(data);
  } catch (error) {
    return error;
  }
};
/**
 * @name sendEmail
 * @async
 * @description function for sending emails to users
 * @param {String} receiver email of the receipient
 * @param {String} subject subject of email to be sent
 * @param {String} content content text to be sent to user
 * @return {objects} return true for successful email sending or error on failure
 *
 * */

// create reusable transporter object using the default SMTP transport
const transporter = nodeMailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: nodeMailerUsername, // generated ethereal user
    pass: nodeMailerPassword, // generated ethereal password
  },
});

export const emailSender = async ({ from, bcc, subject, html }) => {
  // send mail with defined transport object
  const message = {
    from,
    bcc,
    subject,
    html
  };
  await transporter.sendMail(message);
};
