require('dotenv').config();

const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const Strategy = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

const PORT = 3000;

const config = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
};

const AUTH_OPTIONS = {
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
};

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

passport.serializeUser((user, done) => {
  //this user is the profile object that comes from the verifyCallback function
  done(null, user.id);  
});

passport.deserializeUser((id, done) => {
  //This is where & how the req.user is populated from the cookies in the middleware
  done(null, id);
})

const app = express();

//middlewares
app.use(helmet());
app.use(cookieSession({
  name: 'session',
  maxAge: 1000 * 60 * 60 * 24,
  keys: [ config.COOKIE_KEY_1, config.COOKIE_KEY_2 ],
}))
app.use(passport.initialize());
app.use(passport.session());

//endpoints
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['email']
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
  })
);

app.get('/auth/logout', (req, res) => {
  req.logOut(); //Removes req.user and clears any logged in session
  return res.redirect('/');
});

app.get('/secret', checkLoggedIn, (req, res) => {
  return res.send('Your personal secret value is 42!!')
});

app.get('/failure', (req, res) => {
  return res.send('Failed to log in!');
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

https.createServer({
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem'),
}, app).listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

function checkLoggedIn(req, res, next) {
  //comes from the deserializeUser middleware function (with the done callback function)
  console.log('Current user: ', req.user)
  const isLoggedIn = req.isAuthenticated() && req.user;

  if (!isLoggedIn) {
    return res.status(401).json({
      error: 'You must log in',
    });
  }

  next();
}

function verifyCallback(accessToken, refreshToken, profile, done) {
  done(null, profile);
}
