const express = require("express");
const router = express.Router();
const { listAllMentors, createMentorshipMeeting, getProfile } = require("../utils/mentee_utils");


// GET /api/mentee/home
router.get("/home", async (req, res, next) => {
    try {
        let { page = "1", pageSize = "12", name, region, skills, experience } = req.query;
        page = Math.max(parseInt(page, 10) || 1, 1);
        pageSize = Math.min(Math.max(parseInt(pageSize, 10) || 12, 1), 50);

        const result = await listAllMentors({
            page,
            pageSize,
            name,
            region,
            skills,
            experience
        });
        res.json(result);
    } catch (err) {
        next(err);
    }
});


router.post("/home", async (req, res, next) => {
    try {
      const { mentorId, meetingDate } = req.body;
      const menteeId = req.user.id;//token
  
      if (!mentorId || !meetingDate) {
        return res.status(400).json({ error: "Missing mentorId or meetingDate" });
      }

      const result = await createMentorshipMeeting(menteeId, mentorId, meetingDate);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });
  

// GET /api/mentee/profile
router.get("/profile", async (req, res, next) => {
    try {
      const menteeId = req.user.id; // token - mentee
      const profile = await getProfile(menteeId);
      res.json(profile);
    } catch (err) {
      next(err);
    }
});


module.exports = router;

