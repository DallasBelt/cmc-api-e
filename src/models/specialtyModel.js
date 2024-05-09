const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Specialty = sequelize.define('Specialty', {
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
}, { tableName: 'specialty' });

module.exports = Specialty;