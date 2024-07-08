const express = require('express');
const userRoute = express.Router();

const {
  create,
  verifyEmail,
  resendVerification,
  login,
  findAll,
  findOne,
  update,
  deleteOne,
  logout,
} = require('../services/userService');

const verifyToken = require('../middlewares/verifyToken');

const {
  createValidator,
  loginValidator,
  resendVerificationValidator,
  updateValidator,
} = require('../validators/userValidator');

userRoute.post('/create', createValidator, create);
userRoute.get('/verify-email', verifyEmail);
userRoute.post(
  '/resend-verification',
  resendVerificationValidator,
  resendVerification
);
userRoute.post('/login', loginValidator, login);
userRoute.get('/one', verifyToken, findOne);
userRoute.get('/all', verifyToken, findAll);
userRoute.patch('/update', updateValidator, verifyToken, update);
userRoute.delete('/delete', verifyToken, deleteOne);
userRoute.post('/logout', verifyToken, logout);

module.exports = userRoute;
