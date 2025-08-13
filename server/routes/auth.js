// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

const pool = require('../db');
const { signToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Creates a new user (mentor or mentee), hashes password, returns JWT.
 *
 * Required body fields:
 *   first_name, last_name, email, password, phone, mentor (0|1)
 * Optional:
 *   short_description, image_url, linkedin_url, years_experience
 */

//Rotem implementing, delete later or check if needed


/* 
router.post(
  '/register',
  [
    body('first_name').trim().notEmpty(),
    body('last_name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').trim().notEmpty(),
    body('mentor').isInt({ min: 0, max: 1 }) // 1 = mentor, 0 = mentee
  ],
  async (req, res) => {
    // 1) Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // 2) Extract body safely with defaults for optional fields
    const {
      first_name, last_name, email, password, phone,
      short_description = null,
      image_url = null,
      linkedin_url = null,
      years_experience = null,
      mentor = 0
    } = req.body;

    try {
      // 3) Hash the password (never store plain text)
      const hashed = await bcrypt.hash(password, 12);

      // 4) Insert the user using parameterized query (prevents SQL injection)
      const sql = `
        INSERT INTO users
        (first_name, last_name, password, email, phone, short_description, image_url, linkedin_url, years_experience, mentor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        first_name, last_name, hashed, email, phone,
        short_description, image_url, linkedin_url, years_experience, mentor
      ];

      const [result] = await pool.execute(sql, params);

      // 5) Issue a token so the user is logged-in right after sign-up
      const user = { id: result.insertId, email, mentor };
      const token = signToken(user);

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          email,
          role: mentor ? 'MENTOR' : 'MENTEE',
          first_name,
          last_name
        }
      });
    } catch (err) {
      // email is UNIQUE; duplicate -> ER_DUP_ENTRY
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);
*/


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

//loading profile, implement later, check with Ron

/**
 * GET /api/auth/me
 * Verifies JWT from Authorization header, returns current user's profile.
 */

/* 
router.get('/me', requireAuth, async (req, res) => {
  try {
    const [[user]] = await pool.execute(
      'SELECT id, first_name, last_name, email, phone, mentor FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    );
    if (!user) return res.status(404).json({ error: 'Not found' });

    return res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.mentor ? 'MENTOR' : 'MENTEE'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});
*/


module.exports = router;
