const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Module = sequelize.define('Module', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    unique: true
  }
}, { tableName: 'module' });

module.exports = Module;