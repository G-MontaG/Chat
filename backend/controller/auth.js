'use strict';

const jwt = require('jsonwebtoken');

const helper = require('../../backend/helpers/serverMessage');

exports.checkToken = function (req, res, next) {
  if (req.path === '/landing' || req.path === '/login' || req.path === '/signup') {
    next();
  } else {
    jwt.verify(req.get('Authorization').split(" ")[1], process.env.JWT_SECRET, {
      jwtid: process.env.JWT_ID
    }, (err, payload) => {
      if (err) {
        helper.message(res, 401, {message: "Invalid token"});
      }
      if (payload['user-agent'] !== req.headers['user-agent']) {
        helper.message(res, 401, {message: "Invalid token. User agent doesn't match"});
      } else {
        next();
      }
    });
  }
};
