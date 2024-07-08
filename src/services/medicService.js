const Medic = require('../models/medicModel');

async function createMedic(data, options = {}) {
  try {
    const medic = await Medic.create(data, options);
    return medic;
  } catch (error) {
    throw new Error(`Error creating medic: ${error.message}`);
  }
}

module.exports = {
  createMedic,
};
