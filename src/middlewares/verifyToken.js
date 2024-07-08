const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // Get the token from the cookie
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Access denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = verifyToken;
