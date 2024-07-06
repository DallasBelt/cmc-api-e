const { body } = require('express-validator');

const registerUserValidator = [
  body('email').isEmail().withMessage('Invalid email.'),
  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'
    ),
  body('firstName')
    .isString()
    .withMessage('First name must be a string.')
    .notEmpty()
    .withMessage('First name is required.'),
  body('lastName')
    .isString()
    .withMessage('Last name must be a string.')
    .notEmpty()
    .withMessage('Last name is required.'),
];

const updateUserValidator = [
  body('email').optional().isEmail().withMessage('Invalid email.'),
  body('newPassword')
    .optional()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'
    ),
];

module.exports = {
  registerUserValidator,
  updateUserValidator,
};
