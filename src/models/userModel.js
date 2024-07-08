const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Admin = require('./adminModel');
const Medic = require('./medicModel');
const Assistant = require('./assistantModel');

const User = sequelize.define(
  'User',
  {
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'medic', 'assistant'),
      allowNull: false,
      defaultValue: 'medic',
    },
    verificationCode: {
      type: DataTypes.STRING,
    },
    verificationCodeExpiry: {
      type: DataTypes.DATE,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { tableName: 'user' }
);

// 1:1 User:Admin
User.hasOne(Admin, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Admin.belongsTo(User, {
  foreignKey: 'userId',
});

// 1:1 UserData:Medic
User.hasOne(Medic, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Medic.belongsTo(User, {
  foreignKey: 'userId',
});

// 1:1 UserData:Assistant
User.hasOne(Assistant, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Assistant.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = User;
