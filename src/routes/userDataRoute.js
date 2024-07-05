const express = require('express');
const userDataRoute = express.Router();

const {
  create,
  findOne,
  findAll,
  update,
} = require('../services/userDataService');

const {
  createUserDataValidator,
  updateUserDataValidator,
} = require('../validators/userDataValidator');

const verifyToken = require('../middleware/verifyToken');

userDataRoute.post('/', verifyToken, createUserDataValidator, create);
userDataRoute.get('/', verifyToken, findOne);
userDataRoute.get('/', verifyToken, findAll);
userDataRoute.patch('/', verifyToken, updateUserDataValidator, update);

module.exports = userDataRoute;
