const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { sequelize } = require('../config/db');

const { create: createAdmin } = require('./adminService');
const { sendNewUserEmail } = require('../utils/sendEmail');

const User = require('../models/userModel');

async function create(req, res) {
  let transaction;

  try {
    // Validate the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, role } = req.body;
    const userRole = req.userRole;
    if (!userRole) {
      return res.status(401).json({ message: 'Authorization problem.' });
    }

    // Check logged in user role
    if (userRole.toString() === 'admin') {
      if (role.toString() !== 'medic' && role.toString() !== 'secretary') {
        return res.status(400).json({ message: 'Forbidden.' });
      }
    } else if (userRole.toString() === 'medic') {
      if (role.toString() !== 'patient') {
        return res.status(400).json({ message: 'Forbidden.' });
      }
    } else if (userRole.toString() === 'secretary') {
      return res.status(403).json({ message: 'Forbidden' });
    } else {
      return res.status(403).json({ message: 'Unauthorized role.' });
    }

    //Start the transaction
    transaction = await sequelize.transaction();

    let password;
    let hashedPassword;

    // If the role is 'patient' the password is an empty string
    if (role === 'patient') {
      password = '';
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      // Generete a random password for other roles
      password = Math.random().toString(36).slice(-8);
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create a new user with the provided role
    await User.create(
      {
        email,
        password: hashedPassword,
        role,
        passwordChanged: false,
      },
      { transaction }
    );

    // Send email with login credentials
    if (role.toString() !== 'patient') {
      await sendNewUserEmail(email, password);
    }

    // Commit the transaction
    await transaction.commit();

    return res.status(201).json({ message: 'User created successfully.' });
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

async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed.' });
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

async function updatePassword(req, res) {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.passwordChanged = true;

    await user.save();

    res.clearCookie('token');
    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.log('Error changing password:', error);
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
      return res.status(404).json({ message: 'User was not found.' });
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
      return res.status(404).json({ message: 'Users were not found.' });
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
        return res.status(409).json({ message: 'Email is already in use.' });
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
    return res.status(200).json({ message: 'User was successfully modified.' });
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
      return res.status(404).json({ message: 'User wad not found.' });
    }

    return res.status(200).json({ message: 'User was successfully deleted.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function logout(_, res) {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Successfully logged out.' });
  } catch (error) {
    console.error('Error clearing cookie:', error);
    return res.status(500).json({ message: 'Error logging out.' });
  }
}

module.exports = {
  create,
  login,
  updatePassword,
  findOne,
  findAll,
  update,
  deleteOne,
  logout,
};
