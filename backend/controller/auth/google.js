'use strict';

const https = require('https');
const moment = require('moment');
const jwt = require('jsonwebtoken');

const cs = require('./constants');
const User = require('../../../backend/model/user');
const send = require('../../../backend/helpers/serverMessage');

exports.getGoogleAuth = (req, res, next) => {
  res.send({redirectUrl: cs.googleUrlAuth});
};

exports.getGoogleData = (req, res, next) => {
  new Promise((resolve, reject) => {
    cs.oauth2Client.getToken(req.query.code, function (err, tokens) {
      if (err) {
        send.error(next, 401, 'Google authentication error. Can not get token');
        reject(err);
      }
      cs.oauth2Client.setCredentials(tokens);
      resolve();
    });
  }).then(() => {
    new Promise((resolve, reject) => {
      https.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${cs.oauth2Client.credentials.access_token}`, (res) => {
        res.on('data', (body) => {
          resolve(JSON.parse(body.toString()));
        });
      }).on('error', (err) => {
        send.error(next, 401, 'Google authentication error. Can not get user info');
        reject(err);
      });
    }).then((userData) => {
      console.log(userData);
    }).catch((err) => {
      console.error(err);
    });
  }).catch((err) => {
    console.error(err);
  });
};
