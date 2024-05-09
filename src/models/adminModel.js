const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  }
}, { tableName: 'admin' });

module.exports = Admin;