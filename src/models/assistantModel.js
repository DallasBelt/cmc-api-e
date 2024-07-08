const { sequelize } = require('../config/db');

const Assistant = sequelize.define('Secretary', {}, { tableName: 'assistant' });

module.exports = Assistant;
