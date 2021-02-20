import passport from 'passport';
import googleStrategy from 'passport-google-oauth';
import { Strategy as FacebookStrategy } from 'passport-facebook';
// import { Strategy as TwitterStrategy } from 'passport-twitter';
import { createUserFromSocials } from '../helpers/Utilities';
import {
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
} from '../config/envVariables';

// dotenv.config();
const GoogleStrategy = googleStrategy.OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:2020/api/v1/oauth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(profile, 'jjjjjjjjjjjjjjjjjjjjjjjjjjjj');

      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;
      const username = profile.displayName.replace(/ /g, '_').toLowerCase();
      const email = profile.emails[0].value;
      const image = profile.photos[0].value;

      const data = {
        email,
        firstName,
        lastName,
        username,
        image
      };

      const result = await createUserFromSocials(data);
      // console.log('rrrrrrrrrrrrrrrrrrr', profile);

      return done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_SECRET,
      callbackURL: FACEBOOK_CALLBACk,
      profileFields: ['id', 'displayName', 'photos', 'emails', 'name']
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log('ccccccccccccccccccccccccccccccccccccccccccccccc', profile);
      const email = profile.emails[0].value;
      const lastName = profile.name.familyName.toLocaleLowerCase();
      const firstName = profile.name.givenName.toLocaleLowerCase();
      const username = profile.displayName.replace(/ /g, '_').toLocaleLowerCase();
      const image = profile.photos[0].value;

      const data = {
        email,
        firstName,
        lastName,
        username,
        image
      };

      // const result = await createUserFromSocials(data);

      return done(null, result);
    }
  )
);
/*
passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_KEY,
      consumerSecret: TWITTER_SECRET,
      callbackURL: TWITTER_CALLBACk,
      includeEmail: true
    },
    async (token, tokenSecret, profile, done) => {
      const { username } = profile;
      const image = profile.photos[0].value;
      const email = profile.emails[0].value.toLocaleLowerCase();
      const firstName = 'anonymous';
      const lastName = 'user';

      const data = {
        email,
        firstName,
        lastName,
        username,
        image
      };

      const result = await createUserFromSocials(data);

      return done(null, result);
    }
  )
);
*/
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
