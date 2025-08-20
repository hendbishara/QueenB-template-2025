const express = require("express");
const router = express.Router();
const {updateMentorProfile, getMentorProfile, getPastMeetingsForMentor, getUpcomingMeetingsForMentor, approveMeeting, getPendingMeetingsForMentor, listAllMentors, createMentorshipMeeting, getProfile, getMentorById, getLessonsByMenteeId , getUpcomingLessons, getPendingLessons, getUnavailableSlotsForMentor, updateMenteeProfile} = require("../services/usersService");
const pool = require("../db");
const { requireAuth } = require("../middleware/auth");

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
router.post("/mentee/home", requireAuth, async (req, res, next) => {
  try {
    const { mentorId, meetingDate, meeting_time } = req.body;
    const menteeId = req.user.id; 

    if (!mentorId || !meetingDate || !meeting_time) {
      return res.status(400).json({ error: "Missing mentorId or meetingDate or meeting_time" });
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
    const menteeId = req.user.id;
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

// PUT /api/users/mentee/profile
router.put("/mentee/profile", requireAuth, async (req, res, next) => {
  try {
    const menteeId = req.user.id;
    const updatedFields = req.body;

    const updatedProfile = await updateMenteeProfile(menteeId, updatedFields);

    if (!updatedProfile) {
      return res.status(404).json({ error: "Mentee not found or not updated" });
    }

    res.json(updatedProfile);
  } catch (err) {
    next(err);
  }
});
router.put("/mentee/:id/profile", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedProfile = await updateMenteeProfile(id, updatedFields);

    if (!updatedProfile) {
      return res.status(404).json({ error: "Mentee not found or not updated" });
    }

    res.json(updatedProfile);
  } catch (err) {
    next(err);
  }
});

router.get("/mentor/:id/pending-meetings", async (req, res, next) => {
  const mentorId = req.params.id;
  const meetings = await getPendingMeetingsForMentor(mentorId);
  res.json(meetings);
});

router.get("/mentor/:id/past-meetings", async (req, res, next) => {
  const mentorId = req.params.id;
  const meetings = await getPastMeetingsForMentor(mentorId);
  res.json(meetings);
});

router.get("/mentor/:id/upcoming-meetings", async (req, res, next) => {
  const mentorId = req.params.id;
  const meetings = await getUpcomingMeetingsForMentor(mentorId);
  res.json(meetings);
});

// GET /api/users/mentor/pending-meetings
// router.get("/mentor/pending-meetings", async (req, res, next) => {
//   try {
//     const mentorId = req.user.id; ; // 
//     const meetings = await getPendingMeetingsForMentor(mentorId);
//     res.json(meetings);
//   } catch (err) {
//     next(err);
//   }
// });


router.put("/mentor/approve-meeting", async (req, res, next) => {
  try {
    const { menteeId, meetingDate, meetingTime } = req.body;
    await approveMeeting(menteeId, meetingDate, meetingTime);
    res.json({ success: true });
  } catch (err) {
    next(err); 
  }
});


// GET /api/users/mentor/past-meetings
// router.get("/mentor/past-meetings", async (req, res, next) => {
//   try {
//     const mentorId = req.user.id; ; // או 1
//     const meetings = await getPastMeetingsForMentor(mentorId);
//     res.json(meetings);
//   } catch (err) {
//     next(err);
//   }
// });

// // GET /api/users/mentor/upcoming-meetings
// router.get("/mentor/upcoming-meetings", async (req, res, next) => {
//   try {
//     const mentorId = req.user.id; ;
//     const meetings = await getUpcomingMeetingsForMentor(mentorId);
//     res.json(meetings);
//   } catch (err) {
//     next(err);
//   }
// });

// GET /api/users/mentor/profile
router.get("/mentor/profile", async (req, res, next) => {
  try {
    const mentorId = req.user.id; 
    const profile = await getMentorProfile(mentorId);

    if (!profile) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json(profile);
  } catch (err) {
    next(err);
  }
});


// GET /api/users/mentor/:id/profile  (per-ID)
router.get("/mentor/:id/profile", async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await getMentorProfile(id); // or getMentorById(id) if you prefer
    if (!profile) return res.status(404).json({ error: "Mentor not found" });
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// GET /api/users/mentee/:id/profile  (per-ID)
router.get("/mentee/:id/profile", async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await getProfile(id);
    if (!profile) return res.status(404).json({ error: "Mentee not found" });
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// PUT /api/users/mentor/:id/profile
router.put("/mentor/:id/profile", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const updatedProfile = await updateMentorProfile(id, updatedFields);

    if (!updatedProfile) {
      return res.status(404).json({ error: "Mentor not found or not updated" });
    }

    res.json(updatedProfile);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
