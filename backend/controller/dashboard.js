'use strict';

const helper = require('../../backend/helpers/serverMessage');

exports.getDashboard = function(req, res) {
  console.log("work");
  res.json({
    data: {
      name: "Arthur"
    }
  });
};
