// const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const api = require('./api');

const app = express();

// Cross Origin Resource Sharing
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

// Para que el servidor maneje JSON
app.use(express.json());
// Definimos una ruta estatica
// app.use(express.static(path.join(__dirname, '..', 'public')));

// Convencion
app.use('/v1', api);

// Llamar a la ruta base
// app.get('/', (_, res) => {
//   res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
// });

module.exports = app;
