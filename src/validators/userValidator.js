const { body } = require('express-validator');

const emailValidator = [
  body('email').isEmail().withMessage('Invalid email')
];

const passwordValidator = [
  body('password').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }).withMessage('Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character')
];

module.exports = {
  emailValidator,
  passwordValidator
};