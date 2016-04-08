'use strict';

const _ = require('lodash');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const User = require('../../backend/model/user');
const Token = require('../../backend/model/token');

const helper = require('../../backend/helpers/serverMessage');

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res) {
  req.checkBody('data.email', 'Email is not valid').isEmail();
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', 'Password length must be from 6 to 20').len(6, 20);

  let errors = req.validationErrors();
  if (errors) {
    helper.message(req, res, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      User.findOne({email: _data.email}, (err, user) => {
        if (err) {
          reject(helper.message(req, res, 500, "Mongo database error"));
        }
        if (!user) {
          reject(helper.message(req, res, 401, "Email not found"));
        }
        else {
          resolve(user);
        }
      });
    }).then((user) => {
      let newToken = new Token();
      newToken.setToken();
      user.token = newToken;
      user.save((err) => {
        if (err) {
          helper.message(req, res, 500, "Mongo database error");
        } else {
          helper.message(req, res, 200, "User is authorized", { isAuthorized: true });
        }
      });
    }).catch((err) => {
      console.error(err);
    });
  }
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