const { body } = require('express-validator');

const createValidator = [
  body('role', 'Invalid role.').isIn(['medic', 'assistant']),
  body('email', 'Invalid email.').isEmail(),
  body(
    'password',
    'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'
  ).isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  body('firstName', 'First name is required.').trim().notEmpty().isString(),
  body('lastName', 'Last name is required.').trim().notEmpty().isString(),
  body('documentType', 'Invalid document type.')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['c', 'r', 'p']),
  body('documentNumber')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value, { req }) => {
      const documentType = req.body.documentType;
      if (documentType === 'c') {
        if (!/^\d{10}$/.test(value)) {
          throw new Error('Invalid cedula number.');
        }
      } else if (documentType === 'r') {
        if (!/^\d{13}$/.test(value)) {
          throw new Error('Invalid RUC number.');
        }
      }
      return true;
    }),
  body('dob', 'Invalid date of birth. Use YYYY-MM-DD format.')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601(),
  body('phone', 'Invalid phone number.')
    .optional({ nullable: true, checkFalsy: true })
    .isMobilePhone(['es-EC'], {
      options: { strictMode: false },
    }),
  body('address', 'Address required.')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .notEmpty()
    .isString(),
];

const loginValidator = [
  body('email', 'Invalid email.').isEmail(),
  body('password', 'Password is required.').trim().notEmpty().isString(),
];

const resendVerificationValidator = [body('email', 'Invalid email.').isEmail()];

const updateValidator = [
  body('email', 'Invalid email.').optional().isEmail(),
  body(
    'newPassword',
    'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'
  )
    .optional()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
];

module.exports = {
  createValidator,
  loginValidator,
  resendVerificationValidator,
  updateValidator,
};
