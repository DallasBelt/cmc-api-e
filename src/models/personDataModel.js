const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const User = require('./userModel');
const Patient = require('./patientModel');

const PersonData = sequelize.define(
  'PersonData',
  {
    documentType: {
      type: DataTypes.ENUM,
      values: ['c', 'r', 'p'],
    },
    documentNumber: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
  },
  { tableName: 'personData' }
);

// 1:1 PersonData:User
PersonData.hasOne(User, {
  foreignKey: {
    name: 'personDataId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

User.belongsTo(PersonData, {
  foreignKey: 'personDataId',
});

// 1:1 PersonData:Patient
PersonData.hasOne(Patient, {
  foreignKey: {
    name: 'personDataId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Patient.belongsTo(PersonData, {
  foreignKey: 'personDataId',
});

module.exports = PersonData;
