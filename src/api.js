const express = require('express');

const personRoute = require('./routes/personRoute');
const personDataRoute = require('./routes/personDataRoute');
const userRoute = require('./routes/userRoute');
const medicRoute = require('./routes/medicRoute');
const assistantRoute = require('./routes/assistantRoute');

const api = express.Router();

api.use('/person', personRoute);
api.use('/personData', personDataRoute);
api.use('/user', userRoute);
api.use('/medic', medicRoute);
api.use('/assistant', assistantRoute);

module.exports = api;
