'use strict';

const _ = require('lodash');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../../backend/model/user');

const helper = require('../../backend/helpers/serverMessage');


exports.postLogin = function (req, res, next) {
  req.checkBody('data.email', 'Email is not valid').isEmail();
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', 'Password length must be from 6 to 20').len(6, 20);

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      User.findOne({email: _data.email}, (err, user) => {
        if (err) {
          reject(helper.error(next, 500, "Mongo database error"));
        }
        if (!user) {
          reject(helper.error(next, 401, "Email not found"));
        }
        else {
          user.checkPassword(_data.password).then((result) => {
            if(!result) {
              reject(helper.error(next, 401, "Password didn't match"));
            } else {
              delete _data.email;
              delete _data.password;
              resolve(user);
            }
          }).catch((err) => {
            console.error(err);
          });
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
      helper.message(res, 200, {message: "User is authorized", token: _token});
    }).catch((err) => {
      console.error(err);
    });
  }
};

exports.postSignupLocal = function (req, res, next) {
  req.checkBody('data.firstname', 'Firstname cannot be blank').notEmpty();
  req.checkBody('data.lastname', 'Lastname cannot be blank').notEmpty();
  req.checkBody('data.email', 'Email is not valid').isEmail();
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', 'Password length must be from 6 to 20').len(6, 20);

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      User.findOne({email: _data.email}, (err, user) => {
        if (err) {
          reject(helper.error(next, 500, "Mongo database error"));
        }
        if (user) {
          reject(helper.error(next, 401, "Email is already in use"));
        }
        else {
          let newUser = new User(_data);
          delete _data.email;
          delete _data.password;
          newUser.cryptPassword().then(() => {
            newUser.save((err) => {
              if (err) {
                reject(helper.error(next, 500, "Mongo database error"));
              }
              resolve();
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
              helper.message(res, 200, {message: "User is authorized", token: _token});
            }).catch((err) => {
              console.error(err);
            });
          });
        }
      }).catch((err) => {
        console.error(err);
      });
    });
  }
};