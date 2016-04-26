'use strict';

const https = require('https');
const jwt = require('jsonwebtoken');

const cs = require('./constants');
const User = require('../../../backend/model/user');
const send = require('../../../backend/helpers/serverMessage');

exports.getFacebookAuth = (req, res, next) => {
  console.log(cs.facebookUrlAuth);
  res.send({redirectUrl: cs.facebookUrlAuth});
};

exports.postFacebookAuth = (req, res, next) => {

};