const express = require('express');
const assistantRoute = express.Router();

const { createAssistant } = require('../services/assistantService');

assistantRoute.post('/create', createAssistant);

module.exports = assistantRoute;
