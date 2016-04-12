'use strict';

const _ = require('lodash');
const moment = require('moment');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../../backend/model/user');

const helper = require('../../backend/helpers/serverMessage');

const passwordMinLength = 6;
const passwordMaxLength = 20;

const tokenAlg = 'HS512';
const tokenExp = 7; // days

const emailTokenLength = 8;
const emailTokenExp = 1; //hours

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.postLogin = function (req, res, next) {
  req.checkBody('data.email', 'Email is not valid').isEmail();
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${passwordMinLength} to ${passwordMaxLength}`).len(passwordMinLength, passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      User.findOne({email: _data.email}, (err, user) => {
        if (err) {
          reject(helper.error(next, 500, 'Mongo database error'));
        }
        if (!user) {
          reject(helper.error(next, 401, 'Email not found'));
        } else {
          user.checkPassword(_data.password).then((result) => {
            if (!result) {
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
        algorithm: tokenAlg,
        expiresIn: `${tokenExp}d`,
        jwtid: process.env.JWT_ID
      });
      helper.message(res, 200, {message: 'User is authorized', token: _token});
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
  req.checkBody('data.password', `Password length must be from ${passwordMinLength} to ${passwordMaxLength}`).len(passwordMinLength, passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      User.findOne({email: _data.email}, (err, user) => {
        if (err) {
          reject(helper.error(next, 500, 'Mongo database error'));
        }
        if (user) {
          reject(helper.error(next, 401, 'Email is already in use'));
        } else {
          let newUser = new User(_data);
          delete _data.email;
          delete _data.password;
          newUser.cryptPassword().then(() => {
            newUser.save((err) => {
              if (err) {
                reject(helper.error(next, 500, 'Mongo database error'));
              }
              resolve();
            }).then((user) => {
              // if you keep in token sensitive info encrypt it before use jwt.sign()
              let _token = jwt.sign({
                id: user._id,
                'user-agent': req.headers['user-agent']
              }, process.env.JWT_SECRET, {
                algorithm: tokenAlg,
                expiresIn: `${tokenExp}d`,
                jwtid: process.env.JWT_ID
              });
              helper.message(res, 200, {message: 'User is authorized', token: _token});
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

function generateEmailToken(user, type) {
  if (type === 'forgot') {
    user.forgotPasswordToken.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
    user.forgotPasswordToken.exp = moment().add(emailTokenExp, 'hours');
    return user.forgotPasswordToken.value;
  } else if (type === 'reset') {
    user.passwordResetToken.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
    user.passwordResetToken.exp = moment().add(emailTokenExp, 'hours');
    return user.passwordResetToken.value;
  } else if (type === 'verify') {
    user.emailVerifyToken.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
    user.emailVerifyToken.exp = moment().add(emailTokenExp, 'hours');
    return user.passwordResetToken.value;
  } else {
    return null;
  }
}

exports.postForgotPasswordEmail = function (req, res, next) {
  req.checkBody('data.email', 'Email is not valid').isEmail();

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      User.findOne({email: _data.email}, (err, user) => {
        if (err) {
          reject(helper.error(next, 500, 'Mongo database error'));
        }
        if (!user) {
          reject(helper.error(next, 401, 'Email not found'));
        } else {
          generateEmailToken(user, 'forgot');
          user.save((err) => {
            if (err) {
              reject(helper.error(next, 500, 'Mongo database error'));
            }
            let mailOptions = {
              to: user.email,
              from: 'arthur.osipenko@gmail.com',
              subject: 'Forgot password',
              text: `Hello. This is a token for your account 
              ${user.forgotPasswordToken.value.slice(0, emailTokenLength/2)} ${user.forgotPasswordToken.value.slice(emailTokenLength/2, emailTokenLength)}
              Please go back and enter it in forgot password form.`
            };
            transporter.sendMail(mailOptions, function(err) {
              if (err) {
                reject(err);
              }
              resolve(helper.message(res, 200, {message: 'Token has been sent', flag: true}));
            });
          }).catch((err) => {
            console.error(err);
          });
        }
      }).catch((err) => {
        console.error(err);
      });
    });
  }
};

exports.postForgotPasswordToken = function (req, res, next) {
  req.checkBody('data.token', 'Token cannot be blank').notEmpty();
  req.checkBody('data.password', `Token length must be ${emailTokenLength} digits`).len(emailTokenLength);

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    _data.token = _.replace(_data.token, ' ', '');
    new Promise((resolve, reject) => {
      User.findOne({forgotPasswordToken: {value: _data.token}}, (err, user) => {
        if (err) {
          reject(helper.error(next, 500, 'Mongo database error'));
        }
        if (!user) {
          reject(helper.error(next, 401, 'Token not found'));
        } else if (moment() > user.forgotPasswordToken.exp) {
          reject(helper.error(next, 401, 'Token has expired'));
        } else {
          resolve(helper.message(res, 200, {message: 'Token is valid', flag: true}));
        }
      }).catch((err) => {
        console.error(err);
      });
    });
  }
};

exports.postForgotPasswordNewPassword = function (req, res, next) {
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${passwordMinLength} to ${passwordMaxLength}`).len(passwordMinLength, passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      let newUser = new User(_data);
      delete _data.password;
      newUser.cryptPassword().then(() => {
        newUser.save((err) => {
          if (err) {
            reject(helper.error(next, 500, 'Mongo database error'));
          }
          resolve();
        }).then((user) => {
          // if you keep in token sensitive info encrypt it before use jwt.sign()
          let _token = jwt.sign({
            id: user._id,
            'user-agent': req.headers['user-agent']
          }, process.env.JWT_SECRET, {
            algorithm: tokenAlg,
            expiresIn: `${tokenExp}d`,
            jwtid: process.env.JWT_ID
          });
          helper.message(res, 200, {message: 'User is authorized', token: _token});
        }).catch((err) => {
          console.error(err);
        });
      })
    }).catch((err) => {
      console.error(err);
    });
  }
};