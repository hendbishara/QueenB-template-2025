// server/services/authService.js

// Responsible ONLY for database operations related to registration.
// We keep SQL here so route files stay clean and focused on HTTP.

const bcrypt = require("bcryptjs");
const pool = require("../db"); // your MySQL pool

// Utility: turn "React, Node.js ,  SQL" -> ["React","Node.js","SQL"]
function parseSkills(skillsCsv) {
  if (!skillsCsv || typeof skillsCsv !== "string") return [];
  return [
    ...new Set( // remove duplicates
      skillsCsv
        .split(",") // split by comma
        .map((s) => s.replace(/\s+/g, " ").trim()) //collapse internal spaces to one, then trim ends
        //.map((s) => s.trim()) // trim spaces
        .filter(Boolean) // drop empty parts
    ),
  ].slice(0, 50); // safety: limit to 50
}

async function insertMentorSkills(conn, mentorUserId, skillsCsv) {
  const skills = parseSkills(skillsCsv);
  if (skills.length === 0) return;
  const values = skills.map((s) => [mentorUserId, s]);
  // Use bulk insert for efficiency
  await conn.query(
    "INSERT INTO mentor_skills (mentor_id, skill_name) VALUES ?",
    [values]
  );
}

// Register a mentor (mentor flag = 1) and optionally insert skills
async function registerMentor(data) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const hash = await bcrypt.hash(data.password, 10);

    const [result] = await conn.execute(
      `INSERT INTO users
       (first_name,last_name,password,email,phone,short_description,image_url,linkedin_url,years_experience,mentor,region)
       VALUES (?,?,?,?,?,?,?,?,?,1,?)`,
      [
        data.first_name,
        data.last_name,
        hash,
        data.email,
        data.phone,
        data.short_description ?? null,
        data.image_url ?? null,
        data.linkedin_url ?? null,
        data.years_experience ?? null,
        data.region ?? null,
      ]
    );

    const userId = result.insertId;

    // Insert mentor skills from CSV string (e.g., "React,Node.js,SQL")
    await insertMentorSkills(conn, userId, data.skills);

    await conn.commit();
    return { id: userId };
  } catch (err) {
    await conn.rollback();
    // Re-throw so the route can decide which status/message to send
    throw err;
  } finally {
    conn.release();
  }
}

// Register a mentee (mentor flag = 0)
async function registerMentee(data) {
  const hash = await bcrypt.hash(data.password, 10);

  const [result] = await pool.execute(
    `INSERT INTO users
     (first_name,last_name,password,email,phone,short_description,image_url,linkedin_url,years_experience,mentor,region)
     VALUES (?,?,?,?,?,?,?,?,?,0,?)`,
    [
      data.first_name,
      data.last_name,
      hash,
      data.email,
      data.phone,
      data.short_description ?? null,
      data.image_url ?? null,
      data.linkedin_url ?? null,
      null, // mentee typically has no years_experience
      data.region ?? null,
    ]
  );

  return { id: result.insertId };
}

module.exports = { registerMentor, registerMentee, parseSkills };
