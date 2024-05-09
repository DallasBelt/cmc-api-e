const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Appointment = require('./appointmentModel');
const Specialty = require('./specialtyModel');
const Schedule = require('./scheduleModel');

const Medic = sequelize.define('Medic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  license: {
    type: DataTypes.STRING,
    unique: true
  }
}, { tableName: 'medic' });


// 1:N Medic - Appointment
Medic.hasMany(Appointment, {
  foreignKey: {
    name: 'medicId',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

Appointment.belongsTo(Medic, {
  foreignKey: 'medicId'
});


// N:N Medic - Specialty
Medic.belongsToMany(Specialty, {
  through: 'medicSpecialty',
  foreignKey: 'medicId'
});

Specialty.belongsToMany(Medic, {
  through: 'medicSpecialty',
  foreignKey: 'specialtyId'
});


// N:N Medic - Schedyule
Medic.belongsToMany(Schedule, {
  through: 'medicSchedule',
  foreignKey: 'medicId'
});

Schedule.belongsToMany(Medic, {
  through: 'medicSchedule',
  foreignKey: 'scheduleId'
});


module.exports = Medic;