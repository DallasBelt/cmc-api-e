const { body } = require('express-validator');

const createUserDataValidator = [
  body('documentType')
    .notEmpty()
    .isIn(['c', 'r', 'p'])
    .withMessage('Invalid document type!'),
  body('documentNumber')
    .notEmpty()
    .custom((value, { req }) => {
      const documentType = req.body.documentType;
      if (documentType === 'c') {
        if (!/^\d{10}$/.test(value)) {
          throw new Error('Invalid cedula number!');
        }
      } else if (documentType === 'r') {
        if (!/^\d{13}$/.test(value)) {
          throw new Error('Invalid RUC number!');
        }
      }
      // No validation needed for 'p' type
      return true;
    }),
  body('dob').notEmpty().isISO8601().withMessage('Invalid date of birth!'),
  body('firstName')
    .notEmpty()
    .isString()
    .withMessage('First name must be a non-empty string.'),
  body('lastName')
    .notEmpty()
    .isString()
    .withMessage('Last name must be a non-empty string.'),
  body('phone')
    .notEmpty()
    .isMobilePhone(['es-EC'], { options: { strictMode: false } })
    .withMessage('Invalid phone number!'),
  body('address')
    .notEmpty()
    .isString()
    .withMessage('Address must be a non-empty string'),
];

module.exports = {
  createUserDataValidator,
};
