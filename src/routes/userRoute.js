const express = require('express');
const userRoute = express.Router();

const {
  create,
  login,
  findAll,
  findOne,
  update,
  deleteOne,
} = require('../services/userService');

const {
  createUserValidator,
  updateUserValidator,
} = require('../validators/userValidator');

const verifyToken = require('../middleware/authMiddleware');

userRoute.post('/create', createUserValidator, create);
userRoute.post('/login', login);
userRoute.get('/:id', verifyToken, findOne);
userRoute.get('/', verifyToken, findAll);
userRoute.patch('/:id', verifyToken, updateUserValidator, update);
userRoute.delete('/:id', verifyToken, deleteOne);

module.exports = userRoute;
