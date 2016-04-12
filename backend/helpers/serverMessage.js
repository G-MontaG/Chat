'use strict';
let _data = {};

exports.error = (next, status, message) => {
  let _status = status || 200;
  let _message = message || '';
  let err = new Error(_message);
  err.status = _status;
  next(err);
};

exports.message = (res, status, data) => {
  let _status = status || 200;
  let _data = data || {};
  let _message = _data.message || '';
  let _params = _data.params;
  let _token = _data.token;
  let _flag = _data.flag;

  res.status(_status);
  res.send({
    message: _message,
    params: _params,
    token: _token,
    flag: _flag
  });
};

exports.data = (res, status, data) => {
  let _status = status || 200;
  let _data = data || {};
  res.status(_status);
  res.send(_data);
};