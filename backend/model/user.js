'use strict';

const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  token: { type: String, default: '' },

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  authTokens: Array,

  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  }
}, { timestamps: true });

userSchema.methods.setToken = function (password) {
  this.token = crypto.randomBytes(64).toString('hex');
};

module.exports = mongoose.model('User', userSchema);