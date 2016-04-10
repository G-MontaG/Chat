'use strict';

const _ = require('lodash');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../../backend/model/user');

const helper = require('../../backend/helpers/serverMessage');


exports.postLogin = function (req, res) {
  req.checkBody('data.email', 'Email is not valid').isEmail();
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', 'Password length must be from 6 to 20').len(6, 20);

  let errors = req.validationErrors();
  if (errors) {
    helper.message(req, res, 401, {message: errors[0].msg});
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      User.findOne({email: _data.email}, (err, user) => {
        if (err) {
          reject(helper.message(req, res, 500, {message: "Mongo database error"}));
        }
        if (!user) {
          reject(helper.message(req, res, 401, {message: "Email not found"}));
        }
        else {
          resolve(user);
        }
      });
    }).then((user) => {
      // if you keep in token sensitive info encrypt it before use jwt.sign()
      let _token = jwt.sign({
        id: user._id,
        'user-agent': req.headers['user-agent']
      }, process.env.JWT_SECRET, {
        algorithm: 'HS512',
        expiresIn: '7d',
        jwtid: process.env.JWT_ID
      });
      helper.message(req, res, 200, {message: "User is authorized", token: _token});
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