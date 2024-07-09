const Admin = require('../models/adminModel');

async function createAdmin(data, options = {}) {
  try {
    // Create a new admin record within the given transaction
    const newAdmin = await Admin.create(data, options);
    return newAdmin;
  } catch (error) {
    console.log('Error creating admin user!', error);
    throw new Error('Error creating admin user!');
  }
}

module.exports = {
  createAdmin,
};
