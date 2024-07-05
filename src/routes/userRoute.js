const express = require('express');
const userRoute = express.Router();

const {
  create,
  login,
  updatePassword,
  findAll,
  findOne,
  update,
  deleteOne,
  logout,
} = require('../services/userService');

const verifyToken = require('../middleware/verifyToken');
const verifyPasswordChange = require('../middleware/verifyPasswordChange');

const {
  createUserValidator,
  updateUserValidator,
} = require('../validators/userValidator');

userRoute.post('/login', login);
userRoute.patch(
  '/update-password',
  verifyToken,
  updateUserValidator,
  updatePassword
);
userRoute.post(
  '/create',
  verifyToken,
  verifyPasswordChange,
  createUserValidator,
  create
);
userRoute.get('/one', verifyToken, verifyPasswordChange, findOne);
userRoute.get('/all', verifyToken, verifyPasswordChange, findAll);
userRoute.patch(
  '/update',
  verifyToken,
  verifyPasswordChange,
  updateUserValidator,
  update
);
userRoute.delete('/delete', verifyToken, verifyPasswordChange, deleteOne);
userRoute.post('/logout', verifyToken, logout);

module.exports = userRoute;
