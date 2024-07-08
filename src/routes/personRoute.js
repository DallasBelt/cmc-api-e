const express = require('express');
const personRoute = express.Router();

const { createPerson, deletePerson } = require('../services/personService');

personRoute.post('/create', createPerson);
personRoute.delete('/delete', deletePerson);

module.exports = personRoute;
