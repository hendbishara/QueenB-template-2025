import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Box, Avatar, Chip, Stack , Button} from "@mui/material";
import EmailButton from "./EmailButton";
import PhoneButton from "./PhoneButton";
import LinkedInButton from "./LinkedInButton";
import ScheduleMeeting from "./ScheduleMeeting";

const MentorFullCard = ({ open, onClose, mentor, menteeId = 2  }) => {
  const [showSchedule, setShowSchedule] = useState(false);

  if (!mentor) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar
            src={mentor.image_url || "https://via.placeholder.com/180"}
            sx={{ width: 120, height: 120 }}
          />
          <Typography variant="h6" align="center" sx={{ mt: 1 }}>
            {mentor.first_name} {mentor.last_name}
          </Typography>
          <Typography variant="body1" align="center">{mentor.short_description}</Typography>
          <Typography variant="subtitle2">Experience: {mentor.years_experience} years</Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
            {mentor.skills && mentor.skills.map((skill, i) => (
              <Chip key={i} label={skill} variant="outlined" color="primary" />
            ))}
          </Stack>

          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <EmailButton email={mentor.email} />
            <PhoneButton phone={mentor.phone} />
            <LinkedInButton url={mentor.linkedin_url} />
          </Box>
          <Box mt={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowSchedule((prev) => !prev)}
            >
              {showSchedule ? "Hide Scheduler" : "Schedule Meeting"}
            </Button>

            {showSchedule && (
              <Box mt={4} width="100%">
                <ScheduleMeeting mentorId={mentor.id} />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default MentorFullCard;
