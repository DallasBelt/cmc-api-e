const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Admin = require('./adminModel');
const UserData = require('./userDataModel');

const User = sequelize.define(
  'User',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      notEmpty: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'medic', 'secretary', 'patient'),
      allowNull: false,
      defaultValue: 'medic',
    },
    verificationCode: {
      type: DataTypes.STRING,
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

// 1:1 User:UserData
User.hasOne(UserData, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

UserData.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = User;
