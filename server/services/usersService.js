//const { users } = require("../data/usersData");
// function getAllUsers() {
//   // In a real application, this would fetch data from a database
//   return users;
// }

const pool = require("../pool_db/pool");

function toMenteeDetail(row) {
  return {
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      image_url: row.image_url,
      linkedin_url: row.linkedin_url,
      phone: row.phone,
      email: row.email,
      short_description: row.short_description,
      region: row.region,
      role: row.mentor ? "mentor" : "mentee"
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

  async function listAllMentors(filters = {}) {
    const { name, region, skills, experience } = filters;
    const conditions = ["u.mentor = 1"];
    const params = [];
  
    if (name) {
      conditions.push("(u.first_name LIKE ? OR u.last_name LIKE ?)");
      const likeName = `%${name}%`;
      params.push(likeName, likeName);
    }
  
    if (region) {
      conditions.push("u.region = ?");
      params.push(region);
    }
  
    if (experience) {
      conditions.push("u.years_experience >= ?");
      params.push(Number(experience));
    }
  
    let sql = `
      SELECT DISTINCT u.id, u.first_name, u.last_name, u.email, u.phone, u.image_url, u.linkedin_url
      FROM users u
      LEFT JOIN mentor_skills ms ON ms.mentor_id = u.id
    `;
  
    if (skills) {
      const skillList = skills.split(',').map(s => s.trim());
      const placeholders = skillList.map(() => '?').join(',');
      conditions.push(`ms.skill_name IN (${placeholders})`);
      params.push(...skillList);
    }
  
    if (conditions.length) {
      sql += " WHERE " + conditions.join(" AND ");
    }
  
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
          u.short_description,
          u.mentor,
          u.region
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

async function getLessonsByMenteeId(menteeId) {
  const [rows] = await pool.query(
    `
    SELECT 
      u.first_name AS mentor_name,
      mm.meeting_date,
      mm.meeting_time
    FROM mentorship_meetings mm
    JOIN users u ON mm.mentor_id = u.id
    WHERE mm.mentee_id = ? AND mm.meeting_date < CURDATE() AND mm.approved = 1
    ORDER BY mm.meeting_date DESC
    `,
    [menteeId]
  );
  return rows;
}

async function getUpcomingLessons(menteeId) {
  const query = `
    SELECT 
      u.first_name AS mentor_name,
      mm.meeting_date,
      mm.meeting_time
    FROM mentorship_meetings mm
    JOIN users u ON mm.mentor_id = u.id
    WHERE mm.mentee_id = ? AND mm.meeting_date >= CURDATE() AND mm.approved = 1
    ORDER BY mm.meeting_date ASC
  `;
  const [rows] = await pool.query(query, [menteeId]);
  return rows;
}

async function getPendingLessons(menteeId) {
  const query = `
    SELECT 
      u.first_name AS mentor_name,
      mm.meeting_date,
      mm.meeting_time
    FROM mentorship_meetings mm
    JOIN users u ON mm.mentor_id = u.id
    WHERE mm.mentee_id = ? AND mm.approved = 0
    ORDER BY mm.meeting_date ASC
  `;
  const [rows] = await pool.query(query, [menteeId]);
  return rows;
}
module.exports = {listAllMentors, getMentorById, getProfile, createMentorshipMeeting,getLessonsByMenteeId, getUpcomingLessons, getPendingLessons };

