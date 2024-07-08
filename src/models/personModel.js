const { sequelize } = require('../config/db');

const PersonData = require('./personDataModel');

const Person = sequelize.define('Person', {}, { tableName: 'person' });

// 1:1 Person:PersonData
Person.hasOne(PersonData, {
  foreignKey: {
    name: 'personId',
    allowNull: false,
  },
  onDelete: 'CASCADE',
});

PersonData.belongsTo(Person, {
  foreignKey: 'personId',
});

module.exports = Person;
