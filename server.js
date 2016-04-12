'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
const lusca = require('lusca');
const dotenv = require('dotenv');
const session = require('express-session');
const expressValidator = require('express-validator');
const multer = require('multer');
const path = require('path');
const upload = multer({dest: path.join(__dirname, 'uploads')});

const authController = require('./backend/controller/auth');
const userController = require('./backend/controller/user');
const dashboardController = require('./backend/controller/dashboard');

dotenv.load({path: '.env'});

require('./backend/db');

const app = express();
app.set('port', process.env.SERVER_PORT || 3000);
app.use(compress(6));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}));
app.use(function (req, res, next) {
  if (req.path === '/api/upload') {
    next();
  } else {
    //lusca.csrf()(req, res, next);
    next();
  }
});
app.use(lusca({
  csp: {/* ... */},
  xframe: 'SAMEORIGIN',
  p3p: 'ABCDEF',
  hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
  xssProtection: true
}));

app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31557600000}));

app.post('/api/login', userController.postLogin);
app.post('/api/signup-local', userController.postSignupLocal);
app.post('/api/forgot-password/email', userController.postForgotPasswordEmail);
app.post('/api/forgot-password/token', userController.postForgotPasswordToken);
app.post('/api/forgot-password/new-password', userController.postForgotPasswordNewPassword);

app.use('/api/*', authController.checkToken);

app.get('/api/dashboard', dashboardController.getDashboard);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('*', function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(app.get('port'), function () {
  console.log(`Server listening on port ${app.get('port')} in ${app.get('env')} mode`);
});

module.exports = app;