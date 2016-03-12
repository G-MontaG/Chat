'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: path.join(__dirname, 'uploads') });

dotenv.load({ path: '.env' });

// connection string format: 'mongodb://username:password@localhost:27017/test';
let connectionUrl = [];
connectionUrl.push('mongodb://');
if (process.env.MONGO_USER && process.env.MONGO__PASSWORD) {
  connectionUrl.push(process.env.MONGO_USER + ':' + process.env.MONGO__PASSWORD + '@');
}
connectionUrl.push(process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.DB_NAME);
connectionUrl = connectionUrl.join('');

const connectionOptions = {
  server: {
    auto_reconnect: true,
    socketOptions: {keepAlive: 30000, connectTimeoutMS: 0, socketTimeoutMS: 0}
  }
};

subscribeToMongoEvents(mongoose.connection);
mongoose.connect(connectionUrl, connectionOptions);

function subscribeToMongoEvents(connection) {
  connection.on('connected', () => {
    console.log('Mongoose connected');
  });
  connection.on('open', () => {
    console.log('Mongoose connection opened');
  });
  connection.on('disconnecting', () => {
    console.log('Mongoose disconnecting');
  });
  connection.on('db: disconnected', () => {
    console.log('Mongoose disconnected');
  });
  connection.on('close', () => {
    console.log('Mongoose connection closed');
  });
  connection.on('reconnected', () => {
    console.log('Mongoose reconnected');
  });
  connection.on('error', (error) => {
    console.error(error.message);
  });
}

const app = express();
app.set('port', process.env.SERVER_PORT || 3000);
app.use(compress(6));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
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
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));