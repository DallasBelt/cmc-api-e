const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Secretary = sequelize.define(
  'Secretary',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    timeIn: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    timeOut: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  { tableName: 'secretary' }
);

module.exports = Secretary;
