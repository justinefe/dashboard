import dotenv from 'dotenv';

dotenv.config();

export const {
  PORT,
  NODE_ENV,
  DATABASE_URL,
  TEST_DATABASE_URL,
  CLOUD_NAME,
  API_SECRET,
  API_KEY,
  ENCRYPTION_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK,
  BASE_URL,
  FACEBOOK_APP_ID,
  FACEBOOK_SECRET,
  FACEBOOK_CALLBACk,
  TWITTER_KEY,
  TWITTER_SECRET,
  TWITTER_CALLBACk,
  nodeMailerUsername,
  nodeMailerPassword,
} = process.env;
