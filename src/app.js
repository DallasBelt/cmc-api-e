// const path = require('path');
const express = require('express');
const cors = require('cors');

const api = require('./routes/api');

const app = express();

// Es como dar 'autorizacion'
app.use(cors({
  origin: 'http://localhost:3000',
}));

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