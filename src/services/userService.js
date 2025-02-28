const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const { sequelize } = require('../config/db');

const { sendVerificationLink } = require('../utils/sendEmail');
const { sendVerificationCompleted } = require('../utils/sendEmail');

const User = require('../models/userModel');
const UserData = require('../models/userDataModel');
const Medic = require('../models/medicModel');

async function register(req, res) {
  let transaction;

  try {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    // Get the data from the request body
    const { firstName, lastName, email, password } = req.body;

    //Start the transaction
    transaction = await sequelize.transaction();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = uuidv4();

    // Set verification code expiry to 24 hours from now
    const verificationCodeExpiry = new Date();
    verificationCodeExpiry.setHours(verificationCodeExpiry.getHours() + 24);

    // Send the verification email
    await sendVerificationLink(email, verificationCode);

    // Create a new user with the role of 'medic' and unverified status
    const newUser = await User.create(
      {
        email,
        password: hashedPassword,
        role: 'medic',
        verificationCode,
        verificationCodeExpiry,
        verified: false,
      },
      { transaction }
    );

    // Create a new record in the 'userData' table
    const newUserData = await UserData.create(
      {
        firstName,
        lastName,
        role: 'medic',
        userId: newUser.id,
      },
      { transaction }
    );

    // Create a new record in the 'medic' table
    await Medic.create(
      {
        userDataId: newUserData.id,
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

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
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
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
        userRole: user.role,
        passwordChanged: user.passwordChanged,
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

async function findOne(req, res) {
  try {
    const userId = req.userId;
    const user = await User.findOne({
      where: { id: userId },
      attributes: [
        'email',
        'role',
        'passwordChanged',
        'createdAt',
        'updatedAt',
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

async function findAll(_, res) {
  try {
    const users = await User.findAll({
      attributes: [
        'id',
        'email',
        'role',
        'passwordChanged',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!users) {
      return res.status(404).json({ message: 'Users not found.' });
    }

    return res.status(302).json({ users: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function update(req, res) {
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

async function deleteOne(req, res) {
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

async function logout(_, res) {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out Successfully.' });
  } catch (error) {
    console.error('Error clearing cookie:', error);
    return res.status(500).json({ message: "Couldn't log out." });
  }
}

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  findOne,
  findAll,
  update,
  deleteOne,
  logout,
};
