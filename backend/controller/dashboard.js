'use strict';

const helper = require('../../backend/helpers/serverMessage');

exports.getDashboard = (req, res) => {
  res.json({
    data: {
      name: 'Arthur'
    }
  });
};
