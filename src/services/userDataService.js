const { validationResult } = require('express-validator');

const UserData = require('../models/userDataModel');

async function create(req, res) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authorization problem!' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const userData = req.body;

    const newUserData = await UserData.create({
      userData,
    });

    return res.status(200).json({ message: 'User data created successfully.' });
  } catch (error) {
    console.log('Error creating user data:', error);

    // Unique constraint error
    if (error.parent && error.parent.code === '23505') {
      return res.status(400).json({ message: 'User already exists!' });
    }

    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = { create };
