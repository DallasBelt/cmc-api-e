const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const { sequelize } = require('../config/db');
const { createAdmin } = require('./adminService');

const User = require('../models/userModel');

async function createUser(req, res) {
  let tx;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start a transaction for creating a new user
    let tx = await sequelize.transaction();

    // Create a new record in the 'user' table
    const newUser = await User.create(
      { email, password: hashedPassword, role },
      { transaction: tx }
    );

    // If the user is an admin, create a new record in the 'admin' table
    if (role === 'admin') {
      // Pass transaction to adminService
      await createAdmin(newUser.id, tx);
    }

    // If the user is a medic, create a new record in the 'medic' table
    // if (role === 'medic') {
    //   // todo
    // }

    // Commit the transaction
    await tx.commit();

    return res.status(201).json({ message: 'User successfully created!' });
  } catch (error) {
    console.log('Error creating user:', error);

    // If an error occurrs, revert the transaction
    if (tx) {
      await tx.rollback();
    }

    // Unique constraint error
    if (error.parent && error.parent.code === '23505') {
      return res.status(400).json({ message: 'User already exists!' });
    }

    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed!' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Authentication failed!' });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );
      return res
        .status(200)
        .json({ message: 'Successfully logged in!', token });
    }
    res.status(422).json({ errors: errors.array() });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function findOne(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findByPk(id, {
      attributes: ['email', 'role', 'createdAt', 'updatedAt'],
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
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
      attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
    });
    if (!users) {
      return res.status(404).json({ message: 'Users not found!' });
    }

    return res.status(302).json({ users: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { newEmail, currentPassword, newPassword } = req.body;
      let hasChanges = false;

      if (newEmail && newEmail !== user.email) {
        // Verify if the new email contains 'admin' and if the user is not an admin
        if (newEmail.includes('admin') && user.role !== 'admin') {
          return res.status(409).json({ message: 'Email not valid!' });
        }

        // Verify if the email is already used by another user
        const emailExists = await User.findOne({
          where: { email: newEmail, id: { [Sequelize.Op.ne]: id } },
        });
        if (emailExists) {
          return res.status(409).json({ message: 'Email not valid!' });
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
            .json({ message: 'Your current password is incorrect!' });
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
      return res.status(200).json({ message: 'User successfully modified!' });
    }

    res.status(422).json({ errors: errors.array() });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteOne(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await User.destroy({ where: { id: id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    return res.status(200).json({ message: 'User successfully deleted!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = {
  createUser,
  login,
  findOne,
  findAll,
  update,
  deleteOne,
};
