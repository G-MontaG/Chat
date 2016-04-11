'use strict';

const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {type: String, lowercase: true, unique: true},
  password: String,
  salt: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  authTokens: Array,

  profile: {
    name: {type: String, default: ''},
    gender: {type: String, default: ''},
    location: {type: String, default: ''},
    website: {type: String, default: ''},
    picture: {type: String, default: ''}
  }
}, {timestamps: true});

/**
 * Generate hash based on <code>crypto.pbkdf2('sha512')</code> algorithm
 * @private
 * @param {string} password
 * @param {string} salt
 * @returns {Promise.<Object>|null|error} On success the promise will be resolved with object<br>
 *   <code>{ salt: buffer, hash: buffer }</code>
 *   On error the promise will be rejected with an null if password argument not exist
 *   and with a error if <code>crypto.pbkdf2()</code> function throw error
 */
function getHash(password, salt) {
  return new Promise((resolve, reject) => {
    if (!password || !salt) {
      reject(null);
    }
    let saltStr = salt;
    let length = 512;
    crypto.pbkdf2(password, saltStr, 100000, length, 'sha512', (err, hashStr) => {
      if (err) {
        reject(err);
      }
      resolve(hashStr.toString('hex'));
    });
  });
}

/**
 * Compare passwords based on their hashes
 * @private
 * @param {string} password
 * @param {string} hash
 * @param {string} salt
 * @returns {Promise.<boolean>|null} On success the promise will be resolved with boolean value
 *   On error the promise will be rejected with an null if password, salt or hash arguments not exist
 */
function compareHash(password, hash, salt) {
  if (!password || !hash || !salt) {
    return null;
  }
  return getHash(password, salt).then((generatedHash) => {
    return hash === generatedHash;
  });
}

userSchema.methods.cryptPassword = function () {
  this.salt = crypto.randomBytes(128).toString('base64');
  return getHash(this.password, this.salt).then((hash) => {
    this.password = hash;
  });
};

userSchema.methods.checkPassword = function (password) {
  return compareHash(password, this.password, this.salt).then((result) => {
    return result;
  });
};

module.exports = mongoose.model('User', userSchema);