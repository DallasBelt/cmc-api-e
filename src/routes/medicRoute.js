const express = require('express');
const medicRoute = express.Router();

const { createMedic } = require('../services/medicService');

medicRoute.post('/create', createMedic);

module.exports = medicRoute;
