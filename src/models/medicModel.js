const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/db');

const Appointment = require('./appointmentModel');
const Schedule = require('./scheduleModel');

const Medic = sequelize.define(
  'Medic',
  {
    specialty: {
      type: DataTypes.ARRAY(
        DataTypes.ENUM(
          'General',
          'Acupuntura',
          'Cirugía',
          'Comsiatría',
          'Dermatología',
          'Nutrición',
          'Odontología'
        )
      ),
      defaultValue: ['General'],
      allowNull: false,
    },
    license: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { tableName: 'medic' }
);

// 1:N Medic:Appointment
Medic.hasMany(Appointment, {
  foreignKey: {
    name: 'medicId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

Appointment.belongsTo(Medic, {
  foreignKey: 'medicId',
});

// N:N Medic:Schedule
Medic.belongsToMany(Schedule, {
  through: 'medicSchedule',
  foreignKey: 'medicId',
});

Schedule.belongsToMany(Medic, {
  through: 'medicSchedule',
  foreignKey: 'scheduleId',
});

module.exports = Medic;
