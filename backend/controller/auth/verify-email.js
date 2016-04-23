'use strict';

const moment = require('moment');

const cs = require('./constants');
const User = require('../../../backend/model/user');
const send = require('../../../backend/helpers/serverMessage');

exports.postVerifyEmailToken = (req, res, next) => {
  req.checkBody('data.token', 'Token cannot be blank').notEmpty();
  req.checkBody('data.token', `Token length must be ${cs.emailTokenLength} digits`)
    .len(cs.emailTokenLength, cs.emailTokenLength);

  let errors = req.validationErrors();
  if (errors) {
    send.error(next, 401, errors[0].msg);
  } else {
    if (!req.session.verifyTokentAttempts || !req.session.verifyTokentAttemptsExp) {
      req.session.verifyTokentAttempts = 1;
      req.session.verifyTokentAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.verifyTokentAttemptsExp)) {
      req.session.verifyTokentAttempts = 1;
      req.session.verifyTokentAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (req.session.verifyTokentAttempts > 3) {
      send.error(next, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.verifyTokentAttempts++;
      let _data = req.body.data;
      new Promise((resolve, reject) => {
        User.findOne({'emailVerifyToken.value': _data.token}, (err, user) => {
          if (err) {
            send.error(next, 500, 'Mongo database error');
            reject(err);
          }
          if (!user) {
            reject(send.error(next, 401, 'Token not found'));
          } else if (moment() > user.forgotPasswordToken.exp) {
            reject(send.error(next, 401, 'Token has expired'));
          } else {
            user.emailVerifyToken = undefined;
            user.emailConfirmed = true;
            user.save((err) => {
              if (err) {
                send.error(next, 500, 'Mongo database error');
                reject(err);
              }
              resolve(send.message(res, 200, {message: 'Email is confirmed', flag: true}));
            });
          }
        });
      }).catch((err) => {
        console.error(err);
      });
    }
  }
};