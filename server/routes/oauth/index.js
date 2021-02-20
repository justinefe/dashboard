import express from 'express';
import dotenv from 'dotenv';
import passport from '../../services/passport';
// import { encryptQuery } from '../../helpers/Utilities';

dotenv.config();

const oauthRouter = express();

// const redirect = (req, res) => res.redirect(`${process.env.FRONTEND_STAGING_URL}/#/signin?token=${encryptQuery(req.user.token)}&username=${req.user.username}`);

// google login
oauthRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

oauthRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/v1/error'
  }),
  /* istanbul ignore next */
  // (req, res) => {
  //   res.send('Google Login Successful');
  // }
);
/*
// facebook login
oauthRouter.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));
oauthRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/api/v1/error'
  }),
  /* istanbul ignore next */
/*
  redirect
);

// twiiter login
oauthRouter.get('/twitter', passport.authenticate('twitter', { scope: ['include_email=true'] }));
oauthRouter.get(
  '/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/api/v1/error'
  }),
  /* istanbul ignore next */
// redirect
// );

export default oauthRouter;
