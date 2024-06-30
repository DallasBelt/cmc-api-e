const express = require('express');

const userRoute = require('./routes/userRoute');
// const personDataRoute = require('./routes/personDataRoute');
// const medicRoute = require('./routes/medicRoute');
// const patientRoute = require('./routes/patientRoute');

const api = express.Router();

api.use('/user', userRoute);
// api.use('/personData', personDataRoute);
// api.use('/medic', medicRoute);
// api.use('/patient', patientRoute);

module.exports = api;
