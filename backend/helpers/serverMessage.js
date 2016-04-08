'use strict';

exports.message = (req, res, status, message, params) => {
  let _status = 200;
  let _message = message || "";
  let _params = params || "";
  res.status(_status);
  res.send({
    data: req.body.data,
    message: _message,
    params: _params
  });
  res.end();
};