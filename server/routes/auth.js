const express = require("express");
const { registerMentor, registerMentee } = require("../services/authService");
const { signToken, requireAuth } = require("../middleware/auth");
const pool = require("../db");
const router = express.Router();
// POST /api/auth/register/mentor
router.post("/register/mentor", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      short_description,
      image_url,
      linkedin_url,
      years_experience,
      region,
      skills, // skills CSV string e.g. "React,Node.js,SQL"
    } = req.body;

    // Basic validation (server-side)
    if (!first_name || !last_name || !email || !password || !phone) {
      return res.status(400).json({ error: "missing required fields" });
    }

    const { id } = await registerMentor({
      first_name,
      last_name,
      email,
      password,
      phone,
      short_description,
      image_url,
      linkedin_url,
      years_experience,
      region,
      skills,
    });

    // Client can redirect to /login after success
    return res.status(201).json({ ok: true, id });
  } catch (e) {
    // Handle unique email violations gracefully
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "email already exists" });
    }
    console.error(e);
    return res.status(500).json({ error: "failed to register mentor" });
  }
});

// POST /api/auth/register/mentee
router.post("/register/mentee", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      short_description,
      image_url,
      linkedin_url,
      region,
    } = req.body;

    if (!first_name || !last_name || !email || !password || !phone) {
      return res.status(400).json({ error: "missing required fields" });
    }

    const { id } = await registerMentee({
      first_name,
      last_name,
      email,
      password,
      phone,
      short_description,
      image_url,
      linkedin_url,
      region,
    });

    return res.status(201).json({ ok: true, id });
  } catch (e) {
    if (e && e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "email already exists" });
    }
    console.error(e);
    return res.status(500).json({ error: "failed to register mentee" });
  }
});

/**
 * POST /api/auth/login
 * Checks credentials, returns JWT if correct.
 *
 * Body: { email, password }
 */
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isString().notEmpty(),
  ],
  async (req, res) => {
    // 1) Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      // 2) Load user by email
      const [rows] = await pool.execute(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email]
      );
      const user = rows[0];
      if (!user)
        return res.status(401).json({ error: "Invalid email or password" });

      // 3) Compare submitted password with stored bcrypt hash
      const ok = await bcrypt.compare(password, user.password);
      if (!ok)
        return res.status(401).json({ error: "Invalid email or password" });

      // 4) Issue token
      const token = signToken(user);

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.mentor ? "MENTOR" : "MENTEE",
          first_name: user.first_name,
          last_name: user.last_name,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
