import { env } from "#config/env.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"));
        }

        const user = await AuthService.handleOAuthLogin({
          provider: "google",
          providerId: profile.id,
          email,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
        });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);
