const { sequelize } = require('../config/db');

const Admin = sequelize.define('Admin', {}, { tableName: 'admin' });

module.exports = Admin;
