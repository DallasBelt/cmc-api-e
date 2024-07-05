const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const api = require('./api');
const createAdminSeed = require('./seeders/createAdminSeed');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use('/v1', api);

(async () => {
  await createAdminSeed(); // Call the seed function
})();

module.exports = app;
