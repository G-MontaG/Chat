'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const bodyParser = require('body-parser');
const logger = require('morgan');
//const lusca = require('lusca');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const multer = require('multer');
const path = require('path');
const upload = multer({dest: path.join(__dirname, 'uploads')});
const jwt = require('jsonwebtoken');

const authController = require('./backend/controller/auth');
const userController = require('./backend/controller/user');
const dashboardController = require('./backend/controller/dashboard');

dotenv.load({ path: '.env' });

require('./backend/db');

const app = express();
app.set('port', process.env.SERVER_PORT || 3000);
app.use(compress(6));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(cookieParser());
// app.use(function(req, res, next) {
//   if (req.path === '/api/upload') {
//     next();
//   } else {
//     lusca.csrf()(req, res, next);
//   }
// });
// app.use(lusca.xframe('SAMEORIGIN'));
// app.use(lusca.xssProtection(true));
//app.use(function(req, res, next) {
//  res.locals.user = req.user;
//  next();
//});
//app.use(function(req, res, next) {
//  if (/api/i.test(req.path)) {
//    req.session.returnTo = req.path;
//  }
//  next();
//});
app.use(express.static(path.join(__dirname, 'public'), {maxAge: 31557600000}));

app.use(authController.checkToken);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', userController.postLogin);
// app.get('/logout', userController.logout);
// app.get('/forgot', userController.getForgot);
// app.post('/forgot', userController.postForgot);
// app.get('/signup', userController.getSignup);
// app.post('/signup', userController.postSignup);

app.get('/dashboard', dashboardController.getDashboard);

app.use('*', function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(app.get('port'), function() {
  console.log(`Server listening on port ${app.get('port')} in ${app.get('env')} mode`);
});

module.exports = app;