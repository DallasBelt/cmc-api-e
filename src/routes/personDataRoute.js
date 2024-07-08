const express = require('express');
const personDataRoute = express.Router();

const {
  createPersonData,
  readPersonData,
  updatePersonData,
  deletePersonData,
} = require('../services/personDataService');

personDataRoute.post('/create', createPersonData);
personDataRoute.get('/read', readPersonData);
personDataRoute.patch('/update', updatePersonData);
personDataRoute.delete('/delete', deletePersonData);

module.exports = personDataRoute;
