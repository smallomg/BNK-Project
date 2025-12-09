const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db/database');

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const profilePicture = profile._json.picture;
  
    console.log("Google OAuth Profile:", profile);
  
    db.query('SELECT * FROM Users WHERE Email = ?', [email], (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return done(err);
      }
      if (results.length > 0) {
        const user = results[0];
        db.query(
          'UPDATE Users SET Name = ?, ProfilePicture = ? WHERE Email = ?',
          [name, profilePicture, email],
          (err, results) => {
            if (err) {
              console.error("Error updating user:", err);
              return done(err);
            }
            return done(null, user);
          }
        );
      } else {
        db.query(
          'INSERT INTO Users (Email, Name, ProfilePicture, OAuthProvider) VALUES (?, ?, ?, ?)',
          [email, name, profilePicture, 'Google'],
          (err, results) => {
            if (err) {
              console.error("Error inserting new user:", err);
              return done(err);
            }
            return done(null, { UserID: results.insertId, Email: email, Name: name, ProfilePicture: profilePicture });
          }
        );
      }
    });
  }));
};
