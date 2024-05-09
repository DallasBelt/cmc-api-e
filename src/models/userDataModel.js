const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Admin = require('./adminModel');
const Medic = require('./medicModel');
const Patient = require('./patientModel');
const Secretary = require('./secretaryModel');
const IdType = require('./idTypeModel');

const UserData = sequelize.define('UserData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  idNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING
  }
}, { tableName: 'userData' });

// 1:1 UserData - Admin
UserData.hasOne(Admin, {
  foreignKey: {
    name: 'userDataId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Admin.belongsTo(UserData, {
  foreignKey: 'userDataId'
});

// 1:1 UserData - Medic
UserData.hasOne(Medic, {
  foreignKey: {
    name: 'userDataId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Medic.belongsTo(UserData, {
  foreignKey: 'userDataId'
});

// 1:1 UserData - Patient
UserData.hasOne(Patient, {
  foreignKey: {
    name: 'userDataId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Patient.belongsTo(UserData, {
  foreignKey: 'userDataId'
});

// 1:1 UserData - Secretary
UserData.hasOne(Secretary, {
  foreignKey: {
    name: 'userDataId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Secretary.belongsTo(UserData, {
  foreignKey: 'userDataId'
});

// 1:N IdType - UserData
IdType.hasOne(UserData, {
  foreignKey: 'idTypeId',
  allowNull: true
});

module.exports =  UserData;