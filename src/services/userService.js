const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const { sequelize } = require('../config/db');

const { sendVerificationLink } = require('../utils/sendEmail');
const { sendVerificationCompleted } = require('../utils/sendEmail');

const { createPerson } = require('./personService');
const { createPersonData } = require('./personDataService');
const { createMedic } = require('./medicService');
const { createAssistant } = require('./assistantService');

const User = require('../models/userModel');
const PersonData = require('../models/personDataModel');

async function createUser(req, res) {
  let transaction;

  try {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Get the data from the request body
    const {
      email,
      password,
      role,
      documentType,
      documentNumber,
      firstName,
      lastName,
      dob,
      phone,
      address,
      specialty,
    } = req.body;

    //Start the transaction
    transaction = await sequelize.transaction();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = uuidv4();

    // Set verification code expiry to 24 hours from now
    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setHours(verificationCodeExpiry.getHours() + 24);

    // Create a new record in the 'person' table
    const newPerson = await createPerson({ transaction });

    // Prepare personData object
    const personData = {
      email,
      firstName,
      lastName,
      personId: newPerson.id,
    };

    if (role !== 'medic') {
      personData.documentType = documentType || null;
      personData.documentNumber = documentNumber || null;
      personData.dob = dob || null;
      personData.phone = phone || null;
      personData.address = address || null;
    }

    // Create a new record in the 'personData' table
    const newPersonData = await createPersonData(
      {
        email,
        firstName,
        lastName,
        documentType,
        documentNumber,
        dob,
        phone,
        address,
        personId: newPerson.id,
      },
      { transaction }
    );

    // Create a new record in the 'user' table
    const newUser = await User.create(
      {
        password: hashedPassword,
        role,
        verificationCode,
        verificationCodeExpiry,
        verified: false, // The user needs to verify their email
        personDataId: newPersonData.id,
      },
      { transaction }
    );

    if (role === 'medic') {
      // Create a new record in the 'medic' table
      await createMedic(
        {
          specialty,
          userId: newUser.id,
        },
        { transaction }
      );
    } else if (role === 'assistant') {
      // Create a new record in the 'assistant' table
      await createAssistant(
        {
          userId: newUser.id,
        },
        { transaction }
      );
    }

    // Commit the transaction
    await transaction.commit();

    // Send the verification email
    await sendVerificationLink(email, verificationCode);

    // Response to the client
    res.status(201).json({
      message:
        'User registered successfully. Please verify your email to complete registration.',
    });
  } catch (error) {
    console.log('Error creating user:', error);

    // If there's a transaction error, rollback
    if (transaction) {
      await transaction.rollback();
    }

    // Unique constraint error
    if (error.parent && error.parent.code === '23505') {
      return res.status(400).json({ message: 'User already exists.' });
    }

    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function verifyEmail(req, res) {
  const { email, code } = req.query;

  try {
    // Find the user with the provided email and verification code
    const user = await User.findOne({
      where: { email, verificationCode: code },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification.' });
    }

    // Check if the verification code has expired
    if (user.verificationCodeExpiry < new Date()) {
      return res
        .status(400)
        .json({ message: 'Verification code has expired.' });
    }

    // Get the user data to pass it to the sendVerificationCompleted function
    const userData = await UserData.findOne({
      where: { userId: user.id },
    });

    await sendVerificationCompleted(
      email,
      userData.firstName,
      userData.lastName
    );

    user.verified = true;
    user.verificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Email successfully verified.' });
  } catch (error) {
    console.error("Couldn't verify email:", error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

async function resendVerification(req, res) {
  // Validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  // Get the data from the request body
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.verified) {
      return res.status(400).json({ message: 'Email already verified.' });
    }

    // Generate a new verification code
    const verificationCode = uuidv4();

    // Set a new verification code expiry to 24 hours from now
    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setHours(verificationCodeExpiry.getHours() + 24);

    // Update the user with the new verification code and expiry
    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;
    await user.save();

    // Send the new verification email
    await sendVerificationLink(email, verificationCode);

    res.status(200).json({
      message: 'A new verification link has been sent to your email address.',
    });
  } catch (error) {
    console.error('Error resending verification email:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

async function login(req, res) {
  try {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Get the data from the request body
    const { email, password } = req.body;

    // Find the email in the 'personData' table
    const personData = await PersonData.findOne({ where: { email: email } });

    // Find the user
    const user = await User.findOne({ where: { personDataId: personData.id } });

    if (!personData || !user) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }

    // Check if the user has verified their email
    if (!user.verified) {
      return res
        .status(403)
        .json({ message: 'Please, verify your email first.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }

    // Create the token
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    // Store the token in a cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    });

    return res.status(200).json({ message: 'Successfully logged in.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function findOneUser(req, res) {
  try {
    // Get the userId from the token
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({ message: 'Authorization problem.' });
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: ['role', 'verified', 'lastSeen', 'createdAt', 'updatedAt'],
      include: [
        {
          model: PersonData,
          attributes: ['email', 'firstName', 'lastName'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(302).json({ user: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function findAllUsers(_, res) {
  try {
    const user = await User.findAll({
      attributes: ['role', 'verified', 'lastSeen', 'createdAt', 'updatedAt'],
      include: [
        {
          model: PersonData,
          as: 'personData',
          attributes: ['email', 'firstName', 'lastName'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'No users found.' });
    }
    return res.status(302).json({ user: user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function updateUser(req, res) {
  let hasChanges = false;

  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({ message: 'Authorization problem.' });
    }

    const user = await User.findByPk(userId);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    const { newEmail, currentPassword, newPassword } = req.body;

    if (newEmail && newEmail !== user.email) {
      // Verify if the email is already used by another user
      const emailExists = await User.findOne({
        where: { email: newEmail, id: { [Sequelize.Op.ne]: id } },
      });
      if (emailExists) {
        return res.status(409).json({ message: 'Email already in use.' });
      }

      // Update the user's email
      user.email = newEmail;
      hasChanges = true;
    }

    if (currentPassword && newPassword) {
      // Verify if the provided password matches with the one in the database
      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!passwordMatch) {
        return res
          .status(400)
          .json({ message: 'Your current password is incorrect.' });
      }

      // Hash the new password and update
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      hasChanges = true;
    }

    if (!hasChanges) {
      return res.status(200).json({ message: 'No changes detected.' });
    }

    await user.save();
    return res.status(200).json({ message: 'User successfully modified.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function deleteUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await User.destroy({ where: { id: id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({ message: 'User successfully deleted.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function logout(req, res) {
  try {
    // Get the userId from the token
    const userId = req.userId;

    // Write the date to the 'lastSeen' column
    await User.update({ lastSeen: new Date() }, { where: { id: userId } });

    // Delete the cookie with the token
    res.clearCookie('token');

    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Error clearing cookie:', error);
    return res.status(500).json({ message: 'Error logging out.' });
  }
}

module.exports = {
  createUser,
  verifyEmail,
  resendVerification,
  login,
  findOneUser,
  findAllUsers,
  updateUser,
  deleteUser,
  logout,
};
