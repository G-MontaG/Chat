'use strict';

const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let User = require('./backend/model/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (!user) {
      return done(null, false, { msg: 'Email ' + email + ' not found.' });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { msg: 'Invalid email or password.' });
      }
    });
  });
}));

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

exports.isAuthorized = (req, res, next) => {
  let provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect('/auth/' + provider);
  }
};