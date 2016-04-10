'use strict';

const jwt = require('jsonwebtoken');

const helper = require('../../backend/helpers/serverMessage');

exports.checkToken = function(req, res, next) {
  if (req.path === '/landing' || req.path === '/login' || req.path === '/signup') {
    next();
  } else {
    jwt.verify(req.get('Authorization').split(" ")[1], process.env.JWT_SECRET, {
      jwtid: process.env.JWT_ID
    }, (err, payload) => {
      if (err) {
        helper.message(req, res, 401, { message: "Invalid token" });
      } else {
        console.log(payload);
        next();
      }
    });
  }
};
