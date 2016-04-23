'use strict';

const moment = require('moment');
const jwt = require('jsonwebtoken');

const cs = require('./constants');
const User = require('../../../backend/model/user');
const send = require('../../../backend/helpers/serverMessage');

exports.postLogin = (req, res, next) => {
  req.checkBody('data.email', 'Email is not valid').isEmail();
  req.checkBody('data.password', 'Password cannot be blank').notEmpty();
  req.checkBody('data.password', `Password length must be from ${cs.passwordMinLength} to ${cs.passwordMaxLength}`)
    .len(cs.passwordMinLength, cs.passwordMaxLength);

  let errors = req.validationErrors();
  if (errors) {
    send.error(next, 401, errors[0].msg);
  } else {
    if (!req.session.loginPasswordAttempts || !req.session.loginPasswordAttemptsExp) {
      req.session.loginPasswordAttempts = 1;
      req.session.loginPasswordAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (moment() > moment(req.session.loginPasswordAttemptsExp)) {
      req.session.loginPasswordAttempts = 1;
      req.session.loginPasswordAttemptsExp = moment().add(cs.expTimeAttempts, 'hours');
    }
    if (req.session.loginPasswordAttempts > 10) {
      send.error(next, 401, 'You have exceeded the number of attempts');
    } else {
      req.session.loginPasswordAttempts++;
      let _data = req.body.data;
      new Promise((resolve, reject) => {
        User.findOne({email: _data.email}, (err, user) => {
          if (err) {
            send.error(next, 500, 'Mongo database error');
            reject();
          }
          if (!user) {
            send.error(next, 401, 'Email not found');
            reject();
          } else {
            user.checkPassword(_data.password).then((result) => {
              if (!result) {
                send.error(next, 401, "Password didn't match");
                reject();
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
          algorithm: cs.tokenAlg,
          expiresIn: `${cs.tokenExp}d`,
          jwtid: process.env.JWT_ID
        });
        send.message(res, 200, {message: 'User is authorized', token: _token});
      }).catch((err) => {
        console.error(err);
      });
    }
  }
};