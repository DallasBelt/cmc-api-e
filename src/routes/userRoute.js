const express = require('express');
const userRoute = express.Router();

const {
  createUser,
  verifyEmail,
  resendVerification,
  login,
  findOneUser,
  findAllUsers,
  updateUser,
  deleteUser,
  logout,
} = require('../services/userService');

const verifyToken = require('../middlewares/verifyToken');

const {
  createValidator,
  loginValidator,
  resendVerificationValidator,
  updateValidator,
} = require('../validators/userValidator');

userRoute.post('/create', createValidator, createUser);
userRoute.get('/verify-email', verifyEmail);
userRoute.post(
  '/resend-verification',
  resendVerificationValidator,
  resendVerification
);
userRoute.post('/login', loginValidator, login);

userRoute.get('/one', verifyToken, findOneUser);
userRoute.get('/all', verifyToken, findAllUsers);
userRoute.patch('/update', updateValidator, verifyToken, updateUser);
userRoute.delete('/delete', verifyToken, deleteUser);
userRoute.post('/logout', verifyToken, logout);

module.exports = userRoute;
