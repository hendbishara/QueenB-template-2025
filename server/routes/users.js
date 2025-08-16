const express = require("express");
const router = express.Router();
const { listAllMentors, createMentorshipMeeting, getProfile, getMentorById, getLessonsByMenteeId , getUpcomingLessons, getPendingLessons, getUnavailableSlotsForMentor} = require("../services/usersService");
const pool = require("../pool_db/pool");

// GET /api/users - Get all users
// router.get("/", (req, res) => {
//   const users = getAllUsers();
//   res.json(users);
// });

// GET /api/users/mentee/home
router.get("/mentee/home", async (req, res, next) => {
  try {
    let { page = "1", pageSize = "12", name, region, skills, experience } = req.query;
    page = Math.max(Number(page) || 1, 1);
    pageSize = Math.max(Number(pageSize) || 12, 1);
    
    const result = await listAllMentors({ name, region, skills, experience });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// POST /api/users/mentee/home
router.post("/mentee/home", async (req, res, next) => {
  try {
    const { mentorId, meetingDate, meeting_time } = req.body;
    //const menteeId = req.user.id; // token
    const menteeId = 2;
    if (!mentorId || !meetingDate || !meeting_time) {
      return res.status(400).json({ error: "Missing mentorId or meetingDate" });
    }

    const result = await createMentorshipMeeting(menteeId, mentorId, meetingDate, meeting_time);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/mentee/profile
router.get("/mentee/profile", async (req, res, next) => {
  try {
    const menteeId = 2;//hard coded
    // const menteeId = req.user.id; // token - mentee
    const profile = await getProfile(menteeId);
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

router.get("/skills", async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT DISTINCT skill_name FROM mentor_skills ORDER BY skill_name"
    );
    const skills = rows.map((row) => row.skill_name);
    res.json(skills);
  } catch (err) {
    next(err);
  }
});


// GET /api/users/mentors/:id
router.get("/mentors/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const mentor = await getMentorById(id);
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }
    res.json(mentor);
  } catch (err) {
    next(err);
  }
});

router.get("/mentee/:id/lessons", async (req, res, next) => {
  try {
    const { id } = req.params;
    const lessons = await getLessonsByMenteeId(id);
    res.json(lessons);
  } catch (err) {
    next(err);
  }
});

router.get("/mentee/:id/upcoming-lessons", async (req, res, next) => {
  try {
    const { id } = req.params;
    const lessons = await getUpcomingLessons(id);
    res.json(lessons);
  } catch (err) {
    next(err);
  }
});

router.get("/mentee/:id/pending-lessons", async (req, res, next) => {
  try {
    const { id } = req.params;
    const pendingLessons = await getPendingLessons(id);
    res.json(pendingLessons);
  } catch (err) {
    next(err);
  }
});

router.get("/mentors/:id/unavailable-slots", async (req, res, next) => {
  try {
    const { id } = req.params;
    const slots = await getUnavailableSlotsForMentor(id);
    res.json(slots);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
