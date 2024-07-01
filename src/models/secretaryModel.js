const { sequelize } = require('../config/db');

const Secretary = sequelize.define('Secretary', {}, { tableName: 'secretary' });

module.exports = Secretary;
