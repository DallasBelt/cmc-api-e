const Assistant = require('../models/assistantModel');

async function createAssistant(data, options = {}) {
  try {
    const assistant = await Assistant.create(data, options);
    return assistant;
  } catch (error) {
    throw new Error(`Error creating assistant: ${error.message}`);
  }
}

module.exports = {
  createAssistant,
};
