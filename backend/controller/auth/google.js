'use strict';

const https = require('https');
const jwt = require('jsonwebtoken');

const cs = require('./constants');
const User = require('../../../backend/model/user');
const send = require('../../../backend/helpers/serverMessage');

const getGoogleCodeUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fapi%2Fgoogle-auth%2Fresponse&,response_type=code&client_id=${process.env.GOOGLE_ID}`;

exports.getGoogleCode = (req, res, next) => {
  res.send({redirectUrl: getGoogleCodeUrl});
};

exports.getGoogleToken = (req, res, next) => {
  if (req.query.error) {
    send.error(next, 401, 'Google authentication error');
    console.error(err);
  } else if (!req.query.code) {
    send.error(next, 401, 'Google authentication error. No code.');
    console.error(err);
  } else {
    https.post('https://www.googleapis.com/oauth2/v4/token',
      `code=${req.query.code}&client_id=${process.env.GOOGLE_ID}&client_secret=${process.env.GOOGLE_KEY}&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fgoogle-auth%2Fcode&grant_type=authorization_code`,
      {'Content-Type': 'application/x-www-form-urlencoded'});
  }
};

exports.getGoogleData = (req, res, next) => {
  // need access_token
  new Promise((resolve, reject) => {
    https.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${cs.googleOauth2Client.credentials.access_token}`, (res) => {
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
};