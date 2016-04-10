'use strict';

const helper = require('../../backend/helpers/serverMessage');

exports.getDashboard = function(req, res) {
  res.json({
    data: {
      name: "Arthur"
    }
  });
};
