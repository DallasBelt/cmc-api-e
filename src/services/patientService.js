const User = require('../models/userModel');
const UserData = require('../models/userDataModel');
const Patient = require('../models/patientModel');


async function create(req, res) {
  try {
    const id = parseInt(req.userId);
    const user = await User.findOne({ where: { id }});

    if (!user) {
      res.status(404).json({ message: 'Error!'});
    }

    const userData = await UserData.findOne({ where: { userId: user.dataValues.id }});
    const { occupation, bloodType, personalAntecedent, familyAntecedent, height, weight } = req.body;
    await Patient.create({ userDataId: userData.dataValues.id, occupation, bloodType, personalAntecedent, familyAntecedent, height, weight });
    res.status(200).json({ message: 'Patient successfully created!'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.'});
  }
}

async function findOne(req, res) {
  try {
    const id = parseInt(req.params.id);
    const patient = await Patient.findOne({ where: { id }});

    if (!patient) {
      res.status(404).json({ message: 'Error!'});
    }

    res.status(200).json({ patient });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.'});
  }
}

async function findAll(req, res) {
  try {
    const patients = await Patient.findAll();
    res.status(200).json({ patients });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.'});
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findOne({ where: { id }});
    if (!user) {
      return res.status(404).json({ message: 'Error!'});
    }

    const patient = await UserData.findOne({ where: { userId: id }});
    const updatedPatientData = req.body;
    for (const field of Object.keys(updatedPatientData)) {
      if (patient[field] !== updatedPatientData[field]) {
        patient[field] = updatedPatientData[field];
        await patient.save();
        return res.status(200).json({ message: 'Data successfully updated!' });
      }
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