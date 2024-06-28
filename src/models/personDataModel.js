const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Admin = require('./adminModel');
const Medic = require('./medicModel');
const Secretary = require('./secretaryModel');
const Patient = require('./patientModel');

const PersonData = sequelize.define(
  'PersonData',
  {
    documentNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    documentType: {
      type: DataTypes.ENUM,
      values: ['c', 'r', 'p'],
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
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
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
  },
  { tableName: 'personData' }
);

// 1:1 PersonData:Admin
PersonData.hasOne(Admin, {
  foreignKey: {
    name: 'personDataId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Admin.belongsTo(PersonData, {
  foreignKey: 'personDataId',
});

// 1:1 PersonData:Medic
PersonData.hasOne(Medic, {
  foreignKey: {
    name: 'personDataId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Medic.belongsTo(PersonData, {
  foreignKey: 'personDataId',
});

// 1:1 PersonData:Secretary
PersonData.hasOne(Secretary, {
  foreignKey: {
    name: 'personDataId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Secretary.belongsTo(PersonData, {
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
