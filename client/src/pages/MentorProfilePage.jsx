import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import api from "../api";
import Lessons from "../components/Lessons";

const MentorProfilePage = () => {
  const { id } = useParams(); // <-- /mentor/:id/profile
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        const response = await api.get(`/users/mentor/${id}/profile`);
        setMentor(response.data);
      } catch (error) {
        console.error("Error fetching mentor profile:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMentorProfile();
  }, [id]);

  // const handleApprove = async (menteeId, meeting_date) => {
  //   try {
  //     await axios.put("/api/users/mentor/approve-meeting", {
  //       menteeId,
  //       meetingDate: meeting_date,
  //     });
  //   } catch (err) {
  //     console.error("Approval failed", err);
  //   }
  // };
  const handleApprove = async (menteeId, meeting_date, meeting_time) => {
    try {
      await api.put("/api/users/mentor/approve-meeting", {
        menteeId,
        meetingDate: meeting_date,
        meetingTime: meeting_time
      });
  
      if (activeTab === 2) {
        setMentor((prev) => ({
          ...prev,
          refresh: Math.random(),
        }));
      }
    } catch (err) {
      console.error("Approval failed", err);
    }
  };
  
  if (loading) {
    return (
      <>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!mentor) {
    return (
      <>
        <Box display="flex" justifyContent="center" mt={5}>
          <Typography variant="h6">Mentor profile not found.</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box sx={{ maxWidth: "900px", mx: "auto", mt: 4, px: 3 }}>
        <Box
          sx={{
            backgroundColor: "#fff",
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              src={mentor.image_url}
              alt="Mentor"
              sx={{ width: 100, height: 100 }}
            />
            <Box>
              <Typography variant="h5">
                {mentor.first_name} {mentor.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mentor.short_description}
              </Typography>
              <Typography>Email: {mentor.email}</Typography>
              <Typography>Phone: {mentor.phone}</Typography>
              <Typography>Region: {mentor.region}</Typography>
            </Box>
          </Box>
        </Box>

        <Box mt={4}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            centered
          >
            <Tab label="Past Meetings" />
            <Tab label="Upcoming Meetings" />
            <Tab label="Pending Approvals" />
          </Tabs>

          <Divider sx={{ my: 2 }} />

          {activeTab === 0 && (
            <Lessons
              role="mentor"
              userId={mentor.id}
              apiPath="past-meetings"
              emptyMessage="No past meetings."
            />
          )}

          {activeTab === 1 && (
            <Lessons
              role="mentor"
              userId={mentor.id}
              apiPath="upcoming-meetings"
              emptyMessage="No upcoming meetings."
              refresh={mentor.refresh}

            />
          )}

        {activeTab === 2 && (
            <Lessons
            role="mentor"
            userId={mentor.id}
            apiPath="pending-meetings"
            emptyMessage="No pending meetings."
            showApproveButton
            onApprove={handleApprove}
            refresh={mentor.refresh}
          />

        )}
        </Box>
      </Box>
    </>
  );
};

export default MentorProfilePage;
