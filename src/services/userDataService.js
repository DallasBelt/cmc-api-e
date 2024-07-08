const { validationResult } = require('express-validator');

const UserData = require('../models/personDataModel');

async function create(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authorization problem.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      documentType,
      documentNumber,
      dob,
      firstName,
      lastName,
      phone,
      address,
    } = req.body;

    await UserData.create({
      userId,
      documentType,
      documentNumber,
      dob,
      firstName,
      lastName,
      phone,
      address,
    });

    return res
      .status(200)
      .json({ message: 'User data was created successfully.' });
  } catch (error) {
    console.log('Error creating user data:', error);

    // Unique constraint error
    if (error.parent && error.parent.code === '23505') {
      return res.status(400).json({ message: 'User already exists.' });
    }

    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function findOne(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authorization problem.' });
    }

    const userData = await UserData.findOne({
      where: { userId },
      attributes: [
        documentType,
        documentNumber,
        dob,
        firstName,
        lastName,
        phone,
        address,
      ],
    });

    if (!userData) {
      return res.status(404).json({ message: 'User data was not found.' });
    }

    return res.status(302).json(userData);
  } catch (error) {
    console.log('Error finding user data:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function findAll(req, res) {
  try {
    const userId = req.userId;
    const userRole = req.userRole;

    if (!userId) {
      return res.status(401).json({ message: 'Authorization problem.' });
    }

    if (!userRole || !Array.isArray(userRole) || !userRole.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden.' });
    }

    const usersData = await UserData.findAll();

    if (!usersData) {
      return res.status(404).json({ message: "Users' data was not found." });
    }

    return res.status(302).json(usersData);
  } catch (error) {
    console.log('Error finding userd=s data:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function update(req, res) {
  try {
    // Authenticaded user ID retrieved from the token
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authorization problem.' });
    }

    const userData = await UserData.findOne({ where: { userId } });
    if (!userData) {
      return res.status(404).json({ message: 'User data was not found' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    const newUserData = req.body;
    let hasChanges = false;

    if (
      newUserData.documentType &&
      newUserData.documentType !== userData.documentType
    ) {
      userData.documentType = newUserData.documentType;
      hasChanges = true;
    }
    if (
      newUserData.documentNumber &&
      newUserData.documentNumber !== userData.documentNumber
    ) {
      userData.documentNumber = newUserData.documentNumber;
      hasChanges = true;
    }
    if (newUserData.dob && newUserData.dob !== userData.dob) {
      userData.dob = newUserData.dob;
      hasChanges = true;
    }
    if (newUserData.firstName && newUserData.firstName !== userData.firstName) {
      userData.firstName = newUserData.firstName;
      hasChanges = true;
    }
    if (newUserData.lastName && newUserData.lastName !== userData.lastName) {
      userData.lastName = newUserData.lastName;
      hasChanges = true;
    }
    if (newUserData.phone && newUserData.phone !== userData.phone) {
      userData.phone = newUserData.phone;
      hasChanges = true;
    }
    if (newUserData.address && newUserData.address !== userData.address) {
      userData.address = newUserData.address;
      hasChanges = true;
    }

    if (!hasChanges) {
      return res.status(200).json({ message: 'No changes detected.' });
    }

    await userData.save();

    return res
      .status(200)
      .json({ message: 'User data was updated successfully.' });
  } catch (error) {
    console.log('Error updating user data:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = { create, findOne, findAll, update };
