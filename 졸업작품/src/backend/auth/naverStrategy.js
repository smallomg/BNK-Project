// naverStrategy.js

const NaverStrategy = require('passport-naver').Strategy;
const db = require('../db/database');

module.exports = (passport) => {
  passport.use(new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/login"
  },
  (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const profilePicture = profile._json.profile_image;const NaverStrategy = require('passport-naver').Strategy;
    const db = require('../db/database');
    
    module.exports = (passport) => {
      passport.use(new NaverStrategy({
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: "/auth/naver/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        const name = profile.displayName;
        const profilePicture = profile._json.profile_image;
    
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
              [email, name, profilePicture, 'Naver'],
              (err, results) => {
                if (err) {
                  console.error("Error inserting new user:", err);
                  return done(err);
                }
                return done(null, { id: results.insertId, email, name, profilePicture });
              }
            );
          }
        });
      }));
    };
    

    console.log("Naver OAuth Profile:", profile);

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
          [email, name, profilePicture, 'Naver'],
          (err, results) => {
            if (err) {
              console.error("Error inserting new user:", err);
              return done(err);
            }
            return done(null, { id: results.insertId, email, name, profilePicture });
          }
        );
      }
    });
  }));
};
