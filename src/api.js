const express = require('express');

const userRoute = require('./routes/userRoute');
const userDataRoute = require('./routes/userDataRoute');
const medicRoute = require('./routes/medicRoute');
const roleRoute = require('./routes/roleRoute');
const patientRoute = require('./routes/patientRoute');
const moduleRoute = require('./routes/moduleRoute');
const specialtyRoute = require('./routes/specialtyRoute');

const api = express.Router();

api.use('/user', userRoute);
api.use('/userData', userDataRoute);
api.use('/role', roleRoute);
api.use('/medic', medicRoute);
api.use('/patient', patientRoute);
api.use('/module', moduleRoute);
api.use('/specialty', specialtyRoute);

module.exports = api;