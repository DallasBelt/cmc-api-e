const PersonData = require('../models/personDataModel');

async function createPersonData(data, options = {}) {
  try {
    const personData = await PersonData.create(data, options);
    return personData;
  } catch (error) {
    throw new Error(`Error creating person data: ${error.message}`);
  }
}

async function readPersonData(id) {
  try {
    const personData = await PersonData.findByPk(id);
    if (!personData) {
      throw new Error('Person data not found.');
    }
    return personData;
  } catch (error) {
    throw new Error(`Error reading person data: ${error.message}`);
  }
}

async function updatePersonData(id, newData) {
  try {
    const personData = await PersonData.findByPk(id);
    if (!personData) {
      throw new Error('Person data not found.');
    }
    await personData.update(newData);
    return personData;
  } catch (error) {
    throw new Error(`Error updating person data: ${error.message}`);
  }
}

async function deletePersonData(id) {
  try {
    const personData = await PersonData.findByPk(id);
    if (!personData) {
      throw new Error('Person data not found.');
    }
    await personData.destroy();
    return true;
  } catch (error) {
    throw new Error(`Error deleting person data: ${error.message}`);
  }
}

module.exports = {
  createPersonData,
  readPersonData,
  updatePersonData,
  deletePersonData,
};
