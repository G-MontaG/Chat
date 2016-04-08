'use strict';

const crypto = require('crypto');
const mongoose = require('mongoose');
const moment = require('moment');

const tokenSchema = new mongoose.Schema({
  value: String,
  expiryDate: Date
});

tokenSchema.methods.setToken = function (password) {
  this.value = crypto.randomBytes(64).toString('hex');
  this.expiryDate = moment().add(7, 'days');
};

tokenSchema.methods.checkToken = function (token) {
  return (this.value === token && this.expiryDate > moment());
};

module.exports = mongoose.model('Token', tokenSchema);
