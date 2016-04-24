'use strict';

const https = require('https');
const jwt = require('jsonwebtoken');

const cs = require('./constants');
const User = require('../../../backend/model/user');
const send = require('../../../backend/helpers/serverMessage');

exports.getGoogleAuth = (req, res, next) => {
  res.send({redirectUrl: cs.googleUrlAuth});
};

exports.postGoogleAuth = (req, res, next) => {
  cs.oauth2Client.getToken(req.body.data.code, function (err, tokens) {
    delete req.body.data.code;
    if (err) {
      send.error(next, 401, 'Google authentication error. Can not get token');
      console.error(err);
    }
    cs.oauth2Client.setCredentials(tokens);
    new Promise((resolve, reject) => {
      https.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${cs.oauth2Client.credentials.access_token}`, (res) => {
        res.on('data', (body) => {
          resolve(JSON.parse(body.toString()));
        });
      }).on('error', (err) => {
        send.error(next, 401, 'Google authentication error. Can not get user info');
        reject(err);
      });
    }).then((googleUserData) => {
      new Promise((resolve, reject) => {
        User.findOne({email: googleUserData.email}, (err, user) => {
          if (err) {
            send.error(next, 500, 'Mongo database error');
            reject(err);
          }
          if (!user) {
            let _data = {
              email: googleUserData.email,
              password: '',
              profile: {
                firstname: googleUserData.given_name,
                lastname: googleUserData.family_name,
                gender: googleUserData.gender,
                picture: googleUserData.picture,
                language: googleUserData.locale
              }
            };
            let newUser = new User(_data);
            delete googleUserData.email;
            delete _data.email;
            _data.password = newUser.createPassword();
            cs.generateEmailToken(newUser, 'verify');
            newUser.cryptPassword().then(() => {
              newUser.save((err, user) => {
                if (err) {
                  send.error(next, 500, 'Mongo database error');
                  reject(err);
                }
                let mailOptions = {
                  to: user.email,
                  from: 'arthur.osipenko@gmail.com',
                  subject: 'Hello on XXX',
                  text: `Hello. This is credentials for your account.
                You no need google account every time. You can use this
                Email: ${user.email}
                Password: ${_data.password}
                
                This is a token for your account 
                ${user.emailVerifyToken.value.slice(0, cs.emailTokenLength / 2)} ${user.emailVerifyToken.value.slice(cs.emailTokenLength / 2, cs.emailTokenLength)}
                Please go back and enter it in your profile to verify your email.`
                };
                delete _data.password;
                cs.transporter.sendMail(mailOptions, function (err) {
                  if (err) {
                    send.error(next, 500, 'Send email error');
                    reject(err);
                  }
                  resolve(user);
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
            });
          } else {
            delete googleUserData.email;
            user.picture = googleUserData.picture;
            user.language = googleUserData.locale;
            user.save((err, user) => {
              if (err) {
                send.error(next, 500, 'Mongo database error');
                reject(err);
              }
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
              resolve();
            });
          }
        }).catch((err) => {
          console.error(err);
        });
      });
    }).catch((err) => {
      console.error(err);
    });
  });
};