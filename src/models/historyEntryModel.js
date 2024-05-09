const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Exam = require('./examModel');

const HistoryEntry = sequelize.define('HistoryEntry', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  diagnostic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  treatment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prescription: {
    type: DataTypes.STRING
  },
  bodyTemperature: {
    type: DataTypes.INTEGER
  },
  heartRate: {
    type: DataTypes.INTEGER
  },
  oxygenSaturation: {
    type: DataTypes.INTEGER
  },
}, { tableName: 'historyEntry' });


// 1:N HistoryEntry - Exam
HistoryEntry.hasMany(Exam, {
  foreignKey: {
    name: 'historyEntryId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Exam.belongsTo(HistoryEntry, {
  foreignKey: 'historyEntryId'
});

module.exports =  HistoryEntry;