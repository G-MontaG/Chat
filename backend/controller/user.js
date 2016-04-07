'use strict';

const _ = require('lodash');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../../backend/model/user');

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res) {
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password cannot be blank').notEmpty();
  req.checkBody('password', 'Password length must be from 6 to 20').len(6, 20);
  req.sanitizeBody('email').normalizeEmail();

  let errors = req.validationErrors();
  console.log("validationErrors", errors);

  if (errors) {
    res.json({
      message: errors
    });
  }

  res.json({
    message: "All is ok"
  });

  //find
};

// /**
//  * GET /logout
//  * Log out.
//  */
// exports.logout = function(req, res) {
//   req.logout();
//   res.redirect('/');
// };
//
// /**
//  * GET /signup
//  * Signup page.
//  */
// exports.getSignup = function(req, res) {
//   if (req.user) {
//     return res.redirect('/');
//   }
//   res.render('account/signup', {
//     title: 'Create Account'
//   });
// };
//
// /**
//  * POST /signup
//  * Create a new local account.
//  */
// exports.postSignup = function(req, res, next) {
//   req.assert('email', 'Email is not valid').isEmail();
//   req.assert('password', 'Password must be at least 4 characters long').len(4);
//   req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
//   req.sanitize('email').normalizeEmail();
//
//   var errors = req.validationErrors();
//
//   if (errors) {
//     req.flash('errors', errors);
//     return res.redirect('/signup');
//   }
//
//   var user = new User({
//     email: req.body.email,
//     password: req.body.password
//   });
//
//   User.findOne({ email: req.body.email }, function(err, existingUser) {
//     if (existingUser) {
//       req.flash('errors', { msg: 'Account with that email address already exists.' });
//       return res.redirect('/signup');
//     }
//     user.save(function(err) {
//       if (err) {
//         return next(err);
//       }
//       req.logIn(user, function(err) {
//         if (err) {
//           return next(err);
//         }
//         res.redirect('/');
//       });
//     });
//   });
// };