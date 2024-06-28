const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Appointment = sequelize.define(
  'Appointment',
  {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: 'appointment' }
);

module.exports = Appointment;
