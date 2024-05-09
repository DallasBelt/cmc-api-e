const User = require('../models/userModel');
const UserData = require('../models/userDataModel');
const Medic = require('../models/medicModel');


async function create(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findOne({ where: { id }});

    if (!user) {
      res.status(404).json({ message: 'Error!'});
    }

    const userData = await UserData.findOne({ where: { userId: id }});
    const medicLicense = req.body?.license;
    await Medic.create({ userDataId: userData.dataValues.id, license: medicLicense });
    res.status(200).json({ message: 'Medic successfully created!'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.'});
  }
}

async function findOne(req, res) {
  try {
    const id = parseInt(req.params.id);
    const medic = await Medic.findOne({ where: { id }});

    if (!medic) {
      res.status(404).json({ message: 'Error!'});
    }

    res.status(200).json({ medic: medic});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.'});
  }
}

async function findAll(req, res) {
  try {
    const medics = await Medic.findAll();
    res.status(200).json({ medics: medics });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.'});
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const medic = await Medic.findOne({ where: { id }});
    if (!medic) {
      return res.status(404).json({ message: 'Error!'});
    }

    const updatedMedicLicense = req.body?.license;
    if (medic.license !== updatedMedicLicense) {
      medic.license = updatedMedicLicense;
      await medic.save();
      return res.status(200).json('License successfully updated!')
    }

    return res.status(200).json({ message: 'No changes detected.'});
  } catch (error) {
    console.log(error);
    return res.status(500).json('Internal server error.');
  }
}

module.exports = {
  create,
  findOne,
  findAll,
  update
};