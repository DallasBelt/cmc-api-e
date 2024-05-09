const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const UserData = require('./userDataModel');
const Role = require('./roleModel');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
    notEmpty: true
  }
}, { tableName: 'user' });

// 1:1 User - UserData
User.hasOne(UserData, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

UserData.belongsTo(User, {
  foreignKey: 'userId'
});

// N:N User - Role
User.belongsToMany(Role, {
  through: 'userRole',
  foreignKey: 'userId'
});

Role.belongsToMany(User, {
  through: 'userRole',
  foreignKey: 'roleId'
});

module.exports =  User;