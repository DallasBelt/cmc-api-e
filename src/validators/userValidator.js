const { body } = require('express-validator');

const createUserValidator = [
  body('email').isEmail().withMessage('Invalid email!'),

  body('password')
    .if((_, { req }) => req.body.role && req.body.role.includes('admin'))
    .exists({ checkFalsy: true })
    .withMessage('Password is required for admin role.')
    .bail()
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

  body('role')
    .isArray()
    .withMessage('Role must be an array.')
    .custom((value) => {
      const validRoles = ['admin', 'medic', 'patient', 'secretary'];
      for (let role of value) {
        if (!validRoles.includes(role)) {
          throw new Error('Invalid role!');
        }
      }
      return true;
    }),
];

const updateUserValidator = [
  body('email').optional().isEmail().withMessage('Invalid email!'),
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
  createUserValidator,
  updateUserValidator,
};
