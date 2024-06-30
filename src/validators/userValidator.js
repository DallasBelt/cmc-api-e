const { body } = require('express-validator');

const createUserValidator = [
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .custom((value, { req }) => {
      if (req.body.role !== 'admin' && value.includes('admin')) {
        throw new Error(
          "Non-admin users cannot have 'admin' in their email address"
        );
      }
      return true;
    }),
  body('password')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
    ),
  body('role')
    .isIn(['admin', 'medic', 'secretary'])
    .withMessage('Invalid role'),
];

const updateUserValidator = [
  body('email').optional().isEmail().withMessage('Invalid email'),
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
      'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character'
    ),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
};
