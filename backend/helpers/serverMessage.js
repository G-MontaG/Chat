'use strict';

exports.message = (req, res, status, message, params) => {
  let _status = status || 200;
  let _message = message || "";
  let _params = params;

  res.status(_status);
  res.send({
    data: req.body.data,
    status: _status,
    message: _message,
    params: _params
  });
  res.end();
};