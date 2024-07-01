const express = require('express');
const cors = require('cors');
require('dotenv').config();

const api = require('./api');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());
app.use('/v1', api);

module.exports = app;
