const { body } = require('express-validator');

const idValidator = [
  body('idNumber', 'ID can\'t be empty!').if(body('idTypeId').matches('c')).notEmpty().matches(/^\d{10}$/).withMessage('Invalid ID!'),
  body('idNumber', 'RUC can\'t be empty!').if(body('idTypeId').matches('r')).notEmpty().matches(/^\d{13}$/).withMessage('Invalid RUC!'),
];

const phoneValidator = [
  body('phone').isMobilePhone(['es-EC'], { options: { strictMode:  false }}).withMessage('Invalid phone!')
];

module.exports = {
  idValidator,
  phoneValidator
};