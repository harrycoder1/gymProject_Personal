import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Member from "../models/MembersSchema.js";

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done ) => {
      try {
        const { id, displayName, emails , photos } = profile;

        // Check if member already exists
        let member = await Member.findOne({ email: emails[0].value });
        // console.log("phoot of google is " , photos)
        if (!member) {
          // Create a new member if not found
          member = new Member({
            name: displayName,
            email: emails[0].value,
            profileImg:photos[0]?.value
            // gender: 'N/A', // Optional: Modify if needed
          });
          await member.save();
        }

        done(null, member); // Pass the member object to Passport
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((member, done) => {
  done(null, member.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const member = await Member.findById(id);
    done(null, member);
  } catch (error) {
    done(error, null);
  }
});
