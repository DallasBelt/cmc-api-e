const express = require('express');

const specialtyRoute = express.Router();

const {
  create,
  findOne,
  findAll,
  update,
  deleteOne
} = require('../services/specialtyService');

specialtyRoute.post('/', create);
specialtyRoute.get('/:id', findOne);
specialtyRoute.get('/', findAll);
specialtyRoute.patch('/:id', update);
specialtyRoute.delete('/:id', deleteOne);

module.exports = specialtyRoute;