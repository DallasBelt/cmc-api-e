const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Medic = require('./medicModel');
const Patient = require('./patientModel');
const Secretary = require('./secretaryModel');

const UserData = sequelize.define(
  'UserData',
  {
    documentType: {
      type: DataTypes.ENUM,
      values: ['c', 'r', 'p'],
    },
    documentNumber: {
      type: DataTypes.STRING,
    },
    dob: {
      type: DataTypes.DATEONLY,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
  },
  { tableName: 'userData' }
);

// 1:1 UserData:Medic
UserData.hasOne(Medic, {
  foreignKey: {
    name: 'userDataId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Medic.belongsTo(UserData, {
  foreignKey: 'userDataId',
});

// 1:1 UserData:Patient
UserData.hasOne(Patient, {
  foreignKey: {
    name: 'userDataId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Patient.belongsTo(UserData, {
  foreignKey: 'userDataId',
});

// 1:1 UserData:Secretary
UserData.hasOne(Secretary, {
  foreignKey: {
    name: 'userDataId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Secretary.belongsTo(UserData, {
  foreignKey: 'userDataId',
});

module.exports = UserData;
