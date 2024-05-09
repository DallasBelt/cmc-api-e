const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const HistoryEntry = require('./historyEntryModel');

const History = sequelize.define('History', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  }
}, { tableName: 'history' });


// 1:N History - HistoryEntry
History.hasMany(HistoryEntry, {
  foreignKey: {
    name: 'historyId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

HistoryEntry.belongsTo(History, {
  foreignKey: 'historyId'
});


module.exports = History;