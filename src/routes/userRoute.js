const express = require('express');
const userRoute = express.Router();

const {
  createUser,
  login,
  findAll,
  findOne,
  update,
  deleteOne,
} = require('../services/userService');

const {
  updateUserValidator,
  createUserValidator,
} = require('../validators/userValidator');

const verifyToken = require('../middleware/authMiddleware');

userRoute.post('/create', createUserValidator, createUser);
userRoute.post('/login', verifyToken, login);
userRoute.get('/:id', findOne);
userRoute.get('/', findAll);
userRoute.patch('/:id', updateUserValidator, update);
userRoute.delete('/:id', deleteOne);

module.exports = userRoute;
