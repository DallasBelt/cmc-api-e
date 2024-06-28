const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Admin = require('./adminModel');
const Medic = require('./medicModel');
const Secretary = require('./secretaryModel');

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
      type: DataTypes.ENUM,
      values: ['admin', 'medic', 'secretary'],
      allowNull: false,
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

// 1:1 User:Medic
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

// 1:1 User:Secretary
User.hasOne(Secretary, {
  foreignKey: {
    name: 'userId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Secretary.belongsTo(User, {
  foreignKey: 'userId',
});

module.exports = User;
