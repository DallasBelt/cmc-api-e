const jwt = require('jsonwebtoken');

function verifyPasswordChange(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Access denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded.passwordChanged) {
      return res
        .status(403)
        .json({
          error:
            'You need to change your password before accessing this resource.',
        });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = verifyPasswordChange;
