const Module = require('../models/moduleModel.js');

async function findOne(req, res) {
  try {
    const id = parseInt(req.params.id);
    const module = Module.findOne({ where: { id }});
    if (!module) {
      return res.status(404).json({ message: 'Error!' });
    }

    return res.status(302).json({ module: module.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = { findOne };