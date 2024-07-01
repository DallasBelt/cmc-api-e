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
  createUserValidator,
  updateUserValidator,
} = require('../validators/userValidator');

const verifyToken = require('../middleware/authMiddleware');

userRoute.post('/create', createUserValidator, createUser);
userRoute.post('/login', login);
userRoute.get('/:id', verifyToken, findOne);
userRoute.get('/', verifyToken, findAll);
userRoute.patch('/:id', verifyToken, updateUserValidator, update);
userRoute.delete('/:id', verifyToken, deleteOne);

module.exports = userRoute;
