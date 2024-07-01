const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Appointment = require('./appointmentModel');
const History = require('./historyModel');

const Patient = sequelize.define(
  'Patient',
  {
    occupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bloodType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    personalAntecedent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyAntecedent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { tableName: 'patient' }
);

// 1:N Patient:Appointment
Patient.hasMany(Appointment, {
  foreignKey: {
    name: 'patientId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Appointment.belongsTo(Patient, {
  foreignKey: 'patientId',
});

// 1:N Patient:History
Patient.hasOne(History, {
  foreignKey: {
    name: 'patientId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

History.belongsTo(Patient, {
  foreignKey: 'patientId',
});

module.exports = Patient;
