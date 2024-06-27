const express = require('express');
const userDataRoute = express.Router();

const {
  create,
  findOne,
  findAll,
  update,
} = require('../services/userDataService');
const {
  idValidator,
  phoneValidator,
} = require('../validators/userDataValidator');

const verifyToken = require('../middleware/authMiddleware');

userDataRoute.post('/', verifyToken, idValidator, phoneValidator, create);
userDataRoute.get('/:id', findOne);
userDataRoute.get('/', findAll);
userDataRoute.patch('/:id', idValidator, phoneValidator, update);

module.exports = userDataRoute;
