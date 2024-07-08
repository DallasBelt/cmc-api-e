const Person = require('../models/personModel');

async function createPerson(options = {}) {
  try {
    const person = await Person.create({}, options);
    return person;
  } catch (error) {
    throw new Error(`Error creating person: ${error.message}`);
  }
}

async function deletePerson(id) {
  try {
    const person = await Person.findByPk(id);
    if (!person) {
      throw new Error('Person not found.');
    }
    await person.destroy();
    return true;
  } catch (error) {
    throw new Error(`Error deleting person: ${error.message}`);
  }
}

module.exports = {
  createPerson,
  deletePerson,
};
