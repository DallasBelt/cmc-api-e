const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // Se toma el elemento de la posicion 1, que es el token
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied!' });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // Se asigna el userId a req.userId, que es una variable creada
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token!' });
  }
}

module.exports = verifyToken;
