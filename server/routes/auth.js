// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const pool = require('../db');
const { signToken, requireAuth } = require('../middleware/auth');

const router = express.Router();



/**
 * POST /api/auth/login
 * Checks credentials, returns JWT if correct.
 *
 * Body: { email, password }
 */
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()],
  async (req, res) => {
    // 1) Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      // 2) Load user by email
      const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
      const user = rows[0];
      if (!user) return res.status(401).json({ error: 'Invalid email or password' });

      // 3) Compare submitted password with stored bcrypt hash
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

      // 4) Issue token
      const token = signToken(user);

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.mentor ? 'MENTOR' : 'MENTEE',
          first_name: user.first_name,
          last_name: user.last_name
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);



module.exports = router;
