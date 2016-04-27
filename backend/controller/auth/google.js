'use strict';

const https = require('https');
const jwt = require('jsonwebtoken');

const cs = require('./constants');
const User = require('../../../backend/model/user');
const send = require('../../../backend/helpers/serverMessage');

const getGoogleCodeUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fapi%2Fgoogle-auth%2Fresponse&response_type=code&client_id=${process.env.GOOGLE_ID}`;

exports.getGoogleCode = (req, res, next) => {
  res.send({redirectUrl: getGoogleCodeUrl});
};

exports.getGoogleToken = (req, res, next) => {
  if (req.query.error) {
    send.error(next, 401, 'Google authentication error');
    console.error('Google authentication error');
  } else if (!req.query.code) {
    send.error(next, 401, 'Google authentication error. Can not get code');
    console.error('Google authentication error. Can not get code');
  } else {
    new Promise((resolve, reject) => {
      let tokenReq = https.request({
        host: 'www.googleapis.com',
        path: '/oauth2/v4/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, (resToken) => {
        let data = '';
        resToken.on('data', (chunk) => {
          data += chunk;
        });
        resToken.on('end', () => {
          resolve(JSON.parse(data));
        });
      });
      tokenReq.on('error', (err) => {
        send.error(next, 401, 'Google authentication error. Can not get token');
        reject(err);
      });
      tokenReq.write(`code=${req.query.code}&client_id=${process.env.GOOGLE_ID}&client_secret=${process.env.GOOGLE_KEY}&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fapi%2Fgoogle-auth%2Fresponse&grant_type=authorization_code`);
      tokenReq.end();
    }).then((authData) => {
      new Promise((resolve, reject) => {
        let userDataReq = https.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${authData.access_token}`, (resUser) => {
          let data = '';
          resUser.on('data', (chunk) => {
            data += chunk;
          });
          resUser.on('end', () => {
            req.session.googleUserData = JSON.parse(data);
            res.redirect('http://127.0.0.1:3000/google-auth/response');
            resolve();
          });
        });
        userDataReq.on('error', (err) => {
          send.error(next, 401, 'Google authentication error. Can not get user info');
          reject(err);
        });
      }).catch((err) => {
        console.error(err);
      });
    }).catch((err) => {
      console.error(err);
    });
  }
};

exports.getGoogleUser = (req, res, next) => {
  new Promise((resolve, reject) => {
    User.findOne({email: req.session.googleUserData.email}, (err, user) => {
      if (err) {
        send.error(next, 500, 'Mongo database error');
        reject(err);
      }
      if (!user) {
        let _data = {
          email: req.session.googleUserData.email,
          password: '',
          profile: {
            firstname: req.session.googleUserData.given_name,
            lastname: req.session.googleUserData.family_name,
            gender: req.session.googleUserData.gender,
            picture: req.session.googleUserData.picture,
            language: req.session.googleUserData.locale
          }
        };
        let newUser = new User(_data);
        delete req.session.googleUserData;
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
              return user;
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
            resolve();
          }).catch((err) => {
            console.error(err);
          });
        });
      } else {
        user.picture = req.session.googleUserData.picture;
        user.language = req.session.googleUserData.locale;
        user.save((err, user) => {
          delete req.session.googleUserData;
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
    });
  }).catch((err) => {
    console.error(err);
  });
};