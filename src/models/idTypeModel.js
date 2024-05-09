const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const IdType = sequelize.define('IdType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, { tableName: 'idType', timestamps: false });

module.exports = IdType;