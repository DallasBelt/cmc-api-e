const User = require('../models/userModel');

async function verifyEmail(req, res, next) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.verified) {
      return res
        .status(403)
        .json({ message: 'Please, verify your email first.' });
    }

    next();
  } catch (error) {
    console.error('Error while verifying email:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = verifyEmail;
