'use strict';

exports.message = (req, res, status, message, other) => {
  let _status = status || 200;
  let _message = message || "";

  let _params = other.params;
  let _isAuthorized = other.isAuthorized;

  res.status(_status);
  res.send({
    data: req.body.data,
    message: _message,
    params: _params,
    flags: {
      isAuthorized: _isAuthorized
    }
  });
  res.end();
};