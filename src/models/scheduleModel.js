const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, { tableName: 'schedule' });

module.exports = Schedule;