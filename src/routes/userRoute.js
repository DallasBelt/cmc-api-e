const express = require('express');
const userRoute = express.Router();

const { 
  register,
  login,
  // findAll,
  // findOne,
  update,
  deleteOne,
} = require('../services/userService');

const {
  emailValidator,
  passwordValidator
} = require('../validators/userValidator');
// const verifyToken = require('../middleware/authMiddleware');

userRoute.post('/register', emailValidator, passwordValidator, register);
userRoute.post('/login', login);
// usersRoute.get('/', verifyToken, findAll);
// usersRoute.get('/:id', verifyToken, findOne);
userRoute.patch('/:id', passwordValidator, update);
userRoute.delete('/:id', deleteOne);

module.exports = userRoute;