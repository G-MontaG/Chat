'use strict';
let _data = {};

exports.message = (res, status, data) => {
  let _status = status || 200;
  let _data = data || {};
  let _message = _data.message || "";
  let _params = _data.params;
  let _token = _data.token;

  res.status(_status);
  res.send({
    status: _status,
    message: _message,
    params: _params,
    token: _token
  });
};