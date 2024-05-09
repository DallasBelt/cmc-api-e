const express = require('express');
const roleRoute = express.Router();

const { findOne } = require('../services/roleService');

roleRoute.get('/:id', findOne);

module.exports = roleRoute;