const { validationResult } = require('express-validator');

const User = require('../models/userModel');
const UserData = require('../models/userDataModel');
const IdType = require('../models/idTypeModel');

async function create(req, res) {
  try {
    const id = parseInt(req.userId);
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist!" });
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { idNumber, dob, firstName, lastName, phone, address, idTypeId } =
        req.body;

      if (await UserData.findOne({ where: { idNumber } })) {
        return res.status(400).json({ message: 'Error!' });
      }

      const idType = await IdType.findOne({
        where: { name: idTypeId },
        attributes: ['id'],
      });
      await UserData.create({
        idNumber,
        dob,
        firstName,
        lastName,
        phone,
        address,
        idTypeId: idType.dataValues.id,
        userId: user.id,
      });

      return res.status(201).json({ message: 'Data successfully created!' });
    }

    res.status(422).json({ errors: errors.array() });
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
    const userData = await UserData.findOne({ where: { id } });
    if (!userData) {
      return res.status(400).json({ message: 'Error!' });
    }
    return res.status(302).json({ userData: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function findAll(req, res) {
  try {
    const users = await UserData.findAll();
    return res.status(302).json({ users: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({ message: 'Error!' });
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      const userData = await UserData.findOne({ where: { userId: id } });

      // const updatedIdNumber = req.body?.idNumber;
      // const updatedDob = req.body?.dob;
      // const updatedFirstName = req.body?.firstName;
      // const updatedLastName = req.body?.lastName;
      // const updatedPhone = req.body?.phone;
      // const updatedAddress = req.body?.address;

      // userData.idNumber = updatedIdNumber;
      // userData.dob = updatedDob;
      // userData.firstName = updatedFirstName;
      // userData.lastName = updatedLastName;
      // userData.phone = updatedPhone;
      // userData.address = updatedAddress;

      // await userData.save();

      // return res.status(200).json({ message: 'Data successfully updated!', userData: userData });

      const updatedUserData = req.body;

      for (const field of Object.keys(updatedUserData)) {
        if (userData[field] !== updatedUserData[field]) {
          userData[field] = updatedUserData[field];
          await userData.save();
          return res
            .status(200)
            .json({ message: 'Data successfully updated!' });
        }
      }

      return res.status(200).json({ message: 'No changes detected.' });
    }
    res.status(422).json({ errors: errors.array() });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  create,
  findOne,
  findAll,
  update,
};
