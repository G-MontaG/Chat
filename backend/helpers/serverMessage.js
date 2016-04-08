'use strict';
let _data = {};

exports.message = (req, res, status, data) => {
  let _data = data || {};
  let _status = _data.status || 200;
  let _message = _data.message || "";
  let _params = _data.params;
  let _token = _data.token;

  res.status(_status);
  res.send({
    data: req.body.data,
    status: _status,
    message: _message,
    params: _params,
    token: _token
  });
};