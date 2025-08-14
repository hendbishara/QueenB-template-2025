// server/routes/auth.js

// Minimal HTTP layer that calls the service functions.
// Each endpoint validates input superficially and returns JSON.

const express = require("express");
const { registerMentor, registerMentee } = require("../services/authService");

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

module.exports = router;
