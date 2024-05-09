const { Sequelize } = require('sequelize');

const database = 'cmc';
const username = 'cmc';
const password = 'cmc';
const host = 'localhost';
const port = 5432;

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'postgres',
});

module.exports = { sequelize };