const express = require('express');

const moduleRoute = express.Router();

const {
  findOne
} = require('../services/moduleService');

moduleRoute.get('/', findOne);

module.exports = moduleRoute;