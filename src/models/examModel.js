const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Exam = sequelize.define(
  'Exam',
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: 'exam' }
);

module.exports = Exam;
