const { body } = require('express-validator');

const createUserDataValidator = [
  body('documentType')
    .notEmpty()
    .isIn(['c', 'r', 'p'])
    .withMessage('Invalid document type'),
  body('documentNumber')
    .notEmpty()
    .custom((value, { req }) => {
      const documentType = req.body.documentType;
      if (documentType === 'c') {
        if (!/^\d{10}$/.test(value)) {
          throw new Error('Invalid cedula number');
        }
      } else if (documentType === 'r') {
        if (!/^\d{13}$/.test(value)) {
          throw new Error('Invalid RUC number');
        }
      }
      // No validation needed for 'p' type
      return true;
    }),
  body('dob')
    .notEmpty()
    .isISO8601()
    .withMessage('Invalid date of birth. Use YYYY-MM-DD format'),
  body('firstName')
    .notEmpty()
    .isString()
    .withMessage('First name must be a non-empty string'),
  body('lastName')
    .notEmpty()
    .isString()
    .withMessage('Last name must be a non-empty string'),
  body('phone')
    .notEmpty()
    .isMobilePhone(['es-EC'], { options: { strictMode: false } })
    .withMessage('Invalid phone number'),
  body('address')
    .notEmpty()
    .isString()
    .withMessage('Address must be a non-empty string'),
];

const updateUserDataValidator = [
  body('documentType')
    .optional()
    .isIn(['c', 'r', 'p'])
    .withMessage('Invalid document type'),
  body('documentNumber')
    .optional()
    .custom((value, { req }) => {
      const documentType = req.body.documentType;
      const currentDocumentType = req.currentUserData?.documentType;

      if (documentType && documentType !== currentDocumentType) {
        if (!value) {
          throw new Error(
            'Document number is required when document type changes'
          );
        }

        if (documentType === 'c' && !/^\d{10}$/.test(value)) {
          throw new Error('Invalid cedula number');
        } else if (documentType === 'r' && !/^\d{13}$/.test(value)) {
          throw new Error('Invalid RUC number');
        }
      }
      // No validation needed for 'p' type or if documentType didn't change
      return true;
    }),
  body('dob')
    .optional()
    .isISO8601()
    .withMessage('Invalid date of birth. Use YYYY-MM-DD format'),
  body('firstName')
    .optional()
    .isString()
    .withMessage('First name must be a string'),
  body('lastName')
    .optional()
    .isString()
    .withMessage('Last name must be a string'),
  body('phone')
    .optional()
    .isMobilePhone(['es-EC'], { strictMode: false })
    .withMessage('Invalid phone number'),
  body('address').optional().isString().withMessage('Address must be a string'),
];

module.exports = {
  createUserDataValidator,
  updateUserDataValidator,
};
