const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Schedule = sequelize.define(
  'Schedule',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    days: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  { tableName: 'schedule' }
);

module.exports = Schedule;
