const Role = require('../models/roleModel');

async function findOne(req, res) {
  try {
    const id = parseInt(req.params.id);
    const role = await Role.findOne({ where: { id }});
    if (!role) {
      return res.status(404).json({ message: 'Error!' });
    }

    return res.status(201).json({ role: role.name });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = { findOne };