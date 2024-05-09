const Specialty = require('../models/specialtyModel');

async function create(req, res) {
  try {
    const specialty = req.body.name;
    await Specialty.create({ name: specialty });
    return res.status(201).json({ message: 'Specialty successfully created! '});
  } catch (error) {
    if (error.parent && error.parent.code === '23505') {
      return res.status(400).json({ message: 'Error!' });
    }

    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function findOne(req, res) {
  try {
    const id = parseInt(req.params.id);
    const specialty = await Specialty.findOne({ where: { id }});
    if (!specialty) {
      return res.status(400).json({ message: 'Error!' });
    }

    return res.status(302).json({ name: specialty.name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

async function findAll(req, res) {
  try {
    const specialties = await Specialty.findAll({ attributes: ['name'] });
    return res.status(302).json({ specialties });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const specialty = await Specialty.findOne({ where: { id }});
    if (!specialty) {
      return res.status(400).json({ message: 'Error!' });
    }

    const updatedSpecialty = req.body?.name;
    if (specialty.name !== updatedSpecialty) {
      specialty.name = updatedSpecialty;
      await specialty.save();
      return res.status(200).json({ message: 'Specialty successfully updated! '});
    }

    return res.status(200).json({ message: 'No changes detected. '});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

async function deleteOne(req, res) {
  try {
    const id = parseInt(req.params.id);
    const specialty = await Specialty.destroy({ where: { id }});
    if (!specialty) {
      return res.status(400).json({ message: 'Error!' });
    }

    return res.status(200).json({ message: 'Specialty successfully deleted! '});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = {
  create,
  findOne,
  findAll,
  update,
  deleteOne
};