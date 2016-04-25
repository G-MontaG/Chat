'use strict';

module.exports = {
  checkToken: require('./check').checkToken,
  postLogin: require('./login').postLogin,
  postSignupLocal: require('./signup').postSignupLocal,
  postVerifyEmailToken: require('./verify-email').postVerifyEmailToken,
  postForgotPasswordEmail: require('./forgot').postForgotPasswordEmail,
  postForgotPasswordToken: require('./forgot').postForgotPasswordToken,
  postForgotPasswordNewPassword: require('./forgot').postForgotPasswordNewPassword,
  postResetPassword: require('./reset').postResetPassword,
  getGoogleAuth: require('./google').getGoogleAuth,
  postGoogleAuth: require('./google').postGoogleAuth,
  getFacebookAuth: require('./facebook').getFacebookAuth,
  postFacebookAuth: require('./facebook').postFacebookAuth
};