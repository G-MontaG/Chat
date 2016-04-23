'use strict';

const moment = require('moment');

const cs = require('./constants');
const User = require('../../../backend/model/user');
const send = require('../../../backend/helpers/serverMessage');

exports.postResetPassword = (req, res, next) => {
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${cs.passwordMinLength} to ${cs.passwordMaxLength}`)
    .len(cs.passwordMinLength, cs.passwordMaxLength);
  req.checkBody('data.newPassword', 'New password cannot be blank').notEmpty();
  req.checkBody('data.newPassword', `New password length must be from ${cs.passwordMinLength} to ${cs.passwordMaxLength}`)
    .len(cs.passwordMinLength, cs.passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    send.error(next, 401, errors[0].msg);
  } else {
    if (!req.session.resetPasswordAttempts || !req.session.resetPasswordAttemptsExp) {
      req.session.resetPasswordAttempts = 1;
      req.session.resetPasswordAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.resetPasswordAttemptsExp)) {
      req.session.resetPasswordAttempts = 1;
      req.session.resetPasswordAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (req.session.resetPasswordAttempts > 10) {
      send.error(next, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.resetPasswordAttempts++;
      let _data = req.body.data;
      new Promise((resolve, reject) => {
        User.findOne({_id: req.userId}, (err, user) => {
          if (err) {
            send.error(next, 500, 'Mongo database error');
            reject();
          }
          if (!user) {
            send.error(next, 401, 'User not found');
            reject();
          } else {
            user.checkPassword(_data.password).then((result) => {
              if (!result) {
                send.error(next, 401, "Password didn't match");
                reject();
              } else {
                user.password = _data.newPassword;
                delete _data.password;
                delete _data.newPassword;
                user.cryptPassword().then(() => {
                  user.save((err) => {
                    if (err) {
                      send.error(next, 500, 'Mongo database error');
                      reject(err);
                    }
                    send.message(res, 200, {message: 'Password has been changed', flag: true});
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