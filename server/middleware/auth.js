// server/middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Create a signed JWT.
 * `mentor` is 1/0 in DB; we map it to a readable role string.
 */
function signToken(user) {
  const role = user.mentor ? 'MENTOR' : (user.role || 'MENTEE');
  return jwt.sign(
    { id: user.id, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

/**
 * Guard for protected routes. Looks for:
 * Authorization: Bearer <token>
 * If valid, attaches decoded payload to req.user and calls next().
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, email, role, iat, exp }
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional role-based gate (e.g., mentor-only endpoints).
 */

/*
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
  */

module.exports = { signToken, requireAuth, requireRole };
