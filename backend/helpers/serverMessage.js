'use strict';

exports.message = (res, status, message, params) => {
  let _message = message || "";
  let _params = params || "";
  res.status(status);
  res.write(JSON.stringify({
    message: _message,
    params: _params
  }));
  res.end();
};