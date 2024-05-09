const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({ email, password:hashedPassword });
      return res.status(201).json({ message: 'User successfully created!' });
    }
    res.status(422).json( { errors: errors.array() });
  } catch (error) {
    if (error.parent && error.parent.code === '23505') {
      return res.status(400).json({ message: 'Error!' });
    }
    
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email: email } })
      if (!user) {
        return res.status(401).json({message: 'Authentication failed!'});
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({message: 'Authentication failed!'});
      }
      
      const token = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Successfully logged in!', token });
    }
    res.status(422).json( { errors: errors.array() });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// async function findOne(req, res) {
//   try {
//     const id = parseInt(req.params.id);
//     const user = await User.findOne({ where: { id }, attributes: ['email', 'createdAt'] });
//     if (!user) {
//       return res.status(400).json({ message: 'Error!' });
//     }
//     return res.status(302).json({ user: user });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }

// async function findAll(req, res) {
//   try {
//     const users = await User.findAll({ attributes: ['email', 'createdAt'] });
//     return res.status(302).json({ users: users });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }

async function update(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({ message: 'Error!' })
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const updatedPassword = req.body?.password;
      const updatedHashedPassword = await bcrypt.hash(updatedPassword, 10);
      user.password = updatedHashedPassword;
      await user.save();
      return res.status(200).json({message: 'User successfully modified!'});
    }
    
    res.status(422).json( { errors: errors.array() });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteOne(req, res) {
  try {
    const id = parseInt(req.params.id);
    const user = await User.destroy({ where: { id: id }});
    if (!user) {
      return res.status(400).json({ message: 'Error!' });
    }
    
    return res.status(200).json({ message: 'User successfully deleted!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
  // findOne,
  // findAll,
  update,
  deleteOne,
};