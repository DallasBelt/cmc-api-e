const express = require('express');
const patientRoute = express.Router();

const {
  create,
  findOne,
  findAll,
  // update
} = require('../services/patientService');

const verifyToken = require('../middleware/authMiddleware');

patientRoute.post('/', verifyToken, create);
patientRoute.get('/:id', findOne);
patientRoute.get('/', findAll);
// patientRoute.patch('/:id', update);

module.exports = patientRoute;