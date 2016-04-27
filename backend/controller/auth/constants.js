'use strict';
const moment = require('moment');
const crypto = require('crypto');

const nodemailer = require('nodemailer');

const google = require('googleapis');
const GoogleOAuth2 = google.auth.OAuth2;

const OAuth2 = require('oauth').OAuth2;

const passwordMinLength = 8;
const passwordMaxLength = 30;

const tokenAlg = 'HS512';
const tokenExp = 7; // days

const emailTokenLength = 8; // целое число или допиши округление в postForgotPasswordEmail
const emailTokenExp = 0.5; //hours

const expTimeAttempts = 1; //hours

const transporter = nodemailer.createTransport({
  service: 'gmail',
  debug: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

let facebookOauth = new OAuth2(
  process.env.FACEBOOK_APP_ID,
  process.env.FACEBOOK_APP_SECRET,
  'https://www.facebook.com',
  '/dialog/oauth',
  '/dialog/oauth',
  null
);

const facebookUrlAuth = facebookOauth.getAuthorizeUrl({
  redirect_uri: 'http://127.0.0.1:3000/facebook-auth/response'
});

function generateEmailToken(user, type) {
  if (type === 'forgot') {
    user.forgotPasswordToken.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
    user.forgotPasswordToken.exp = moment().add(emailTokenExp, 'hours');
    return user.forgotPasswordToken.value;
  } else if (type === 'reset') {
    user.passwordResetToken.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
    user.passwordResetToken.exp = moment().add(emailTokenExp, 'hours');
    return user.passwordResetToken.value;
  } else if (type === 'verify') {
    user.emailVerifyToken.value = crypto.randomBytes(64).toString('base64').slice(0, emailTokenLength);
    user.emailVerifyToken.exp = moment().add(emailTokenExp, 'hours');
    return user.passwordResetToken.value;
  } else {
    return null;
  }
}

module.exports = {
  passwordMinLength: passwordMinLength,
  passwordMaxLength: passwordMaxLength,
  tokenAlg: tokenAlg,
  tokenExp: tokenExp,
  emailTokenLength: emailTokenLength,
  emailTokenExp: emailTokenExp,
  expTimeAttempts: expTimeAttempts,
  transporter: transporter,
  facebookOauth: facebookOauth,
  facebookUrlAuth: facebookUrlAuth,
  generateEmailToken: generateEmailToken
};