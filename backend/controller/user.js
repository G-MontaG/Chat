'use strict';

const _ = require('lodash');
const moment = require('moment');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../../backend/model/user');

const helper = require('../../backend/helpers/serverMessage');

const passwordMinLength = 8;
const passwordMaxLength = 30;

const tokenAlg = 'HS512';
const tokenExp = 7; // days

const emailTokenLength = 8; // целое число или допиши округление в postForgotPasswordEmail
const emailTokenExp = 0.5; //hours

const expTimeAttempts = 1; //hours

let transporter = nodemailer.createTransport({
  service: 'gmail',
  debug: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

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

exports.postLogin = (req, res, next) => {
  req.checkBody('data.email', 'Email is not valid').isEmail();
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${passwordMinLength} to ${passwordMaxLength}`).len(passwordMinLength, passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    if (!req.session.loginPasswordAttempts || !req.session.loginPasswordAttemptsExp) {
      req.session.loginPasswordAttempts = 1;
      req.session.loginPasswordAttemptsExp = moment().add(expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.loginPasswordAttemptsExp)) {
      req.session.loginPasswordAttempts = 1;
      req.session.loginPasswordAttemptsExp = moment().add(expTimeAttempts, 'hours');
    }
    if (req.session.loginPasswordAttempts > 10) {
      helper.error(next, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.loginPasswordAttempts++;
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
  }
};

exports.postSignupLocal = (req, res, next) => {
  req.checkBody('data.profile.firstname', 'Firstname cannot be blank').notEmpty();
  req.checkBody('data.profile.lastname', 'Lastname cannot be blank').notEmpty();
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
          generateEmailToken(newUser, 'verify');
          newUser.cryptPassword().then(() => {
            newUser.save((err, user) => {
              if (err) {
                reject(helper.error(next, 500, 'Mongo database error'));
              }
              let mailOptions = {
                to: user.email,
                from: 'arthur.osipenko@gmail.com',
                subject: 'Hello on XXX',
                text: `Hello. This is a token for your account 
                ${user.emailVerifyToken.value.slice(0, emailTokenLength/2)} ${user.emailVerifyToken.value.slice(emailTokenLength/2, emailTokenLength)}
                Please go back and enter it in your profile to verify your email.`
              };
              transporter.sendMail(mailOptions, function(err) {
                if (err) {
                  reject(helper.error(next, 500, 'Send email error'));
                }
                resolve();
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
          });
        }
      });
    }).catch((err) => {
      console.error(err);
    });
  }
};

exports.postVerifyEmailToken = (req, res, next) => {
  req.checkBody('data.token', 'Token cannot be blank').notEmpty();
  req.checkBody('data.token', `Token length must be ${emailTokenLength} digits`).len(emailTokenLength, emailTokenLength);

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    if (!req.session.verifyTokentAttempts || !req.session.verifyTokentAttemptsExp) {
      req.session.verifyTokentAttempts = 1;
      req.session.verifyTokentAttemptsExp = moment().add(expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.verifyTokentAttemptsExp)) {
      req.session.verifyTokentAttempts = 1;
      req.session.verifyTokentAttemptsExp = moment().add(expTimeAttempts, 'hours');
    }
    if (req.session.verifyTokentAttempts > 3) {
      helper.error(next, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.verifyTokentAttempts++;
      let _data = req.body.data;
      new Promise((resolve, reject) => {
        User.findOne({'emailVerifyToken.value': _data.token}, (err, user) => {
          if (err) {
            reject(helper.error(next, 500, 'Mongo database error'));
          }
          if (!user) {
            reject(helper.error(next, 401, 'Token not found'));
          } else if (moment() > user.forgotPasswordToken.exp) {
            reject(helper.error(next, 401, 'Token has expired'));
          } else {
            user.emailVerifyToken = undefined;
            user.emailConfirmed = true;
            user.save((err) => {
              if (err) {
                reject(helper.error(next, 500, 'Mongo database error'));
              }
              resolve(helper.message(res, 200, {message: 'Email is confirmed', flag: true}));
            });
          }
        });
      }).catch((err) => {
        console.error(err);
      });
    }
  }
};

exports.postForgotPasswordEmail = (req, res, next) => {
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
                reject(helper.error(next, 500, 'Send email error'));
              }
              resolve(helper.message(res, 200, {message: 'Token has been sent', flag: true}));
            });
          }).catch((err) => {
            console.error(err);
          });
        }
      });
    }).catch((err) => {
      console.error(err);
    });
  }
};

exports.postForgotPasswordToken = (req, res, next) => {
  req.checkBody('data.token', 'Token cannot be blank').notEmpty();
  req.checkBody('data.token', `Token length must be ${emailTokenLength} digits`).len(emailTokenLength, emailTokenLength);

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    if (!req.session.forgotTokentAttempts || !req.session.forgotTokentAttemptsExp) {
      req.session.forgotTokentAttempts = 1;
      req.session.forgotTokentAttemptsExp = moment().add(expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.forgotTokentAttemptsExp)) {
      req.session.forgotTokentAttempts = 1;
      req.session.forgotTokentAttemptsExp = moment().add(expTimeAttempts, 'hours');
    }
    if (req.session.forgotTokentAttempts > 3) {
      helper.error(next, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.forgotTokentAttempts++;
      let _data = req.body.data;
      new Promise((resolve, reject) => {
        User.findOne({'forgotPasswordToken.value': _data.token}, (err, user) => {
          if (err) {
            reject(helper.error(next, 500, 'Mongo database error'));
          }
          if (!user) {
            reject(helper.error(next, 401, 'Token not found'));
          } else if (moment() > user.forgotPasswordToken.exp) {
            reject(helper.error(next, 401, 'Token has expired'));
          } else {
            user.forgotPasswordToken = undefined;
            user.save((err) => {
              if (err) {
                reject(helper.error(next, 500, 'Mongo database error'));
              }
              let _token = jwt.sign({
                id: user._id,
                'user-agent': req.headers['user-agent']
              }, process.env.JWT_SECRET, {
                algorithm: tokenAlg,
                expiresIn: `${tokenExp}d`,
                jwtid: process.env.JWT_ID
              });
              resolve(helper.message(res, 200, {message: 'Token is valid', flag: true, token: _token}));
            });
          }
        });
      }).catch((err) => {
        console.error(err);
      });
    }
  }
};

exports.postForgotPasswordNewPassword = (req, res, next) => {
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${passwordMinLength} to ${passwordMaxLength}`).len(passwordMinLength, passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    let _data = req.body.data;
    new Promise((resolve, reject) => {
      User.findOne({_id: req.userId}, (err, user) => {
        if (err) {
          reject(helper.error(next, 500, 'Mongo database error'));
        }
        if (!user) {
          reject(helper.error(next, 401, 'User not found'));
        } else {
          user.password = _data.password;
          delete _data.password;
          user.cryptPassword().then(() => {
            user.save((err) => {
              if (err) {
                reject(helper.error(next, 500, 'Mongo database error'));
              }
              helper.message(res, 200, {message: 'Password has been changed', flag: true});
              resolve();
            });
          }).catch((err) => {
            console.error(err);
          });
        }
      });
    }).catch((err) => {
      console.error(err);
    });
  }
};

exports.postResetPassword = (req, res, next) => {
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${passwordMinLength} to ${passwordMaxLength}`).len(passwordMinLength, passwordMaxLength);
  req.checkBody('data.newPassword', 'New password cannot be blank').notEmpty();
  req.checkBody('data.newPassword', `New password length must be from ${passwordMinLength} to ${passwordMaxLength}`).len(passwordMinLength, passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    helper.error(next, 401, errors[0].msg);
  } else {
    if (!req.session.resetPasswordAttempts || !req.session.resetPasswordAttemptsExp) {
      req.session.resetPasswordAttempts = 1;
      req.session.resetPasswordAttemptsExp = moment().add(expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.resetPasswordAttemptsExp)) {
      req.session.resetPasswordAttempts = 1;
      req.session.resetPasswordAttemptsExp = moment().add(expTimeAttempts, 'hours');
    }
    if (req.session.resetPasswordAttempts > 10) {
      helper.error(next, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.resetPasswordAttempts++;
      let _data = req.body.data;
      new Promise((resolve, reject) => {
        User.findOne({_id: req.userId}, (err, user) => {
          if (err) {
            reject(helper.error(next, 500, 'Mongo database error'));
          }
          if (!user) {
            reject(helper.error(next, 401, 'User not found'));
          } else {
            user.checkPassword(_data.password).then((result) => {
              if (!result) {
                reject(helper.error(next, 401, "Password didn't match"));
              } else {
                user.password = _data.newPassword;
                delete _data.password;
                delete _data.newPassword;
                user.cryptPassword().then(() => {
                  user.save((err) => {
                    if (err) {
                      reject(helper.error(next, 500, 'Mongo database error'));
                    }
                    helper.message(res, 200, {message: 'Password has been changed', flag: true});
                    resolve();
                  });
                }).catch((err) => {
                  console.error(err);
                });
              }
            }).catch((err) => {
              console.error(err);
            });
          }
        });
      }).catch((err) => {
        console.error(err);
      });
    }
  }
};