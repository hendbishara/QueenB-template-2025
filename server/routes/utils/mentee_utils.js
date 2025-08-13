// routes/utils/mentee_utils.js
const pool = require("../../pool_db/pool");

function toMenteeDetail(row) {
    return {
        id: row.id,
        first_name: row.first_name,
        last_name: row.last_name,
        image_url: row.image_url,
        linkedin_url: row.linkedin_url,
        phone: row.phone,
        email: row.email,
        short_description: row.short_description
    };
}
function toMentorPreview(row) {
  return {
    id: row.id,
    first_name: row.first_name,
    last_name: row.last_name,
    image_url: row.image_url,
    linkedin_url: row.linkedin_url,
    phone: row.phone,
    email: row.email,
  };
}
function toMentorDetail(row) {
    return {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      image_url: row.image_url,
      linkedin_url: row.linkedin_url,
      phone: row.phone,
      email: row.email,
      short_description: row.short_description,
      years_experience: row.years_experience,
      skills: row.skills ? row.skills.split(",") : []
    };
  }
  async function listAllMentors({ page, pageSize, name, region, skills, experience }) {
    let sql = `SELECT * FROM mentors WHERE 1=1`;
    const params = [];

    if (name) {
        sql += ` AND (CONCAT(first_name, ' ', last_name) LIKE ?)`;
        params.push(`%${name}%`);
    }

    if (region) {
        sql += ` AND region = ?`;
        params.push(region);
    }

    if (skills) {
        const skillList = skills.split(",").map(s => s.trim());
        sql += ` AND (${skillList.map(() => `FIND_IN_SET(?, skills) > 0`).join(" AND ")})`;
        params.push(...skillList);
    }

    if (experience) {
        sql += ` AND years_experience >= ?`;
        params.push(parseInt(experience));
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, (page - 1) * pageSize);

    const [rows] = await pool.execute(sql, params);
    return rows.map(toMentorPreview);
}

async function getMentorById(id) {
    const [rows] = await pool.query(
      `SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.image_url,
          u.linkedin_url,
          u.phone,
          u.email,
          u.short_description,
          u.years_experience,
          GROUP_CONCAT(ms.skill_name ORDER BY ms.skill_name SEPARATOR ',') AS skills
       FROM users u
       LEFT JOIN mentor_skills ms ON ms.mentor_id = u.id
       WHERE u.mentor = 1 AND u.id = ?
       GROUP BY u.id`,
      [id]
    );
    if (rows.length === 0) return null;
    return toMentorDetail(rows[0]);
}
  
async function getProfile(id){
    const [rows] = await pool.query(
        `SELECT 
            u.id,
            u.first_name,
            u.last_name,
            u.image_url,
            u.linkedin_url,
            u.phone,
            u.email,
            u.short_description
         FROM users u
         WHERE u.mentor = 0 AND u.id = ?`,
        [id]
    );
    if (rows.length === 0) return null;
    return toMenteeDetail(rows[0]);
}

async function createMentorshipMeeting(menteeId, mentorId, meetingDate) {
    const query = `
      INSERT INTO mentorship_meetings (mentee_id, mentor_id, meeting_date)
      VALUES (?, ?, ?)`;
    try {
        await pool.query(query, [menteeId, mentorId, meetingDate]);
        return { success: true, message: "Meeting scheduled successfully" };
    } catch (err) {
      console.error("Error inserting meeting:", err);
      throw new Error("Could not schedule meeting");
    }
}    
module.exports = { listAllMentors, getMentorById, getProfile, createMentorshipMeeting };
  
