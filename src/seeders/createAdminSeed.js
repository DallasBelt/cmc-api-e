const bcrypt = require('bcrypt');

const { sequelize } = require('../config/db');

const Admin = require('../models/adminModel');
const User = require('../models/userModel');

async function createAdminSeed() {
  let transaction;

  try {
    await sequelize.sync();

    transaction = await sequelize.transaction();

    // Check if there's an admin user
    const existingAdmin = await User.findOne({
      where: { role: 'admin' },
      transaction,
    });

    if (!existingAdmin) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      // Create an admin user
      const adminUser = await User.create(
        {
          email: process.env.ADMIN_EMAIL,
          password: hashedPassword,
          role: 'admin',
          verified: true,
        },
        { transaction }
      );

      // Create a new record for the admin user in the 'admin' table
      await Admin.create(
        {
          userId: adminUser.id,
        },
        { transaction }
      );

      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    await transaction.commit();

    console.log('Seed completed.');
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error('Error while seeding:', error);
    process.exit(1);
  }
}

module.exports = createAdminSeed;
