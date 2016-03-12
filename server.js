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

let connectionOptions = {
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