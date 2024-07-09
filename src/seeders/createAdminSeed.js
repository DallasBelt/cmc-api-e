const bcrypt = require('bcrypt');

const { sequelize } = require('../config/db');

const { createPerson } = require('../services/personService');
const { createPersonData } = require('../services/personDataService');
const { createAdmin } = require('../services/adminService');

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

      // Create the record in the 'person' table
      const person = await createPerson({ transaction });

      // Create the record in the 'personData' table
      const personData = await createPersonData(
        { email: process.env.ADMIN_EMAIL, personId: person.id },
        { transaction }
      );

      // Create the record in the 'user' table
      const user = await User.create(
        {
          password: hashedPassword,
          role: 'admin',
          verified: true,
          personDataId: personData.id,
        },
        { transaction }
      );

      // Create the record in the 'admin' table
      await createAdmin(
        {
          userId: user.id,
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
