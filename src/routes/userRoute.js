const express = require('express');
const userRoute = express.Router();

const {
  register,
  verify,
  login,
  findAll,
  findOne,
  update,
  deleteOne,
  logout,
} = require('../services/userService');

const verifyToken = require('../middlewares/verifyToken');
const verifyEmail = require('../middlewares/verifyEmail');

const {
  registerUserValidator,
  updateUserValidator,
} = require('../validators/userValidator');

userRoute.post('/register', registerUserValidator, register);
userRoute.get('/verify', verify);
userRoute.post('/login', verifyEmail, login);
userRoute.get('/one', verifyToken, findOne);
userRoute.get('/all', verifyToken, findAll);
userRoute.patch('/update', verifyToken, updateUserValidator, update);
userRoute.delete('/delete', verifyToken, deleteOne);
userRoute.post('/logout', verifyToken, logout);

module.exports = userRoute;
