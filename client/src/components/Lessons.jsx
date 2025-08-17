import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

  const Lessons = ({ userId, role = "mentee", apiPath, emptyMessage, showApproveButton = false, onApprove }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const endpoint =
          role === "mentee"
            ? `/api/users/mentee/${userId}/${apiPath}`
            : `/api/users/mentor/${apiPath}`;
        const response = await axios.get(endpoint);
        setLessons(response.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [userId, role, apiPath]);

  if (loading) return <CircularProgress />;
  if (lessons.length === 0)
    return <Typography align="center">{emptyMessage}</Typography>;

  return (
    <Grid container spacing={2} justifyContent="center">
      {lessons.map((lesson, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card elevation={3}>
          <CardContent>
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Box>
      <Typography variant="h6" gutterBottom>
        {role === "mentee"
          ? `Mentor: ${lesson.mentor_name}`
          : `Mentee: ${lesson.mentee_first_name} ${lesson.mentee_last_name}`}
      </Typography>

      <Box display="flex" alignItems="center" gap={1}>
        <EventIcon fontSize="small" />
        <Box>
          <Typography variant="body2" color="text.secondary">
            {new Date(lesson.meeting_date).toLocaleDateString()}
          </Typography>
          {lesson.meeting_time && (
            <Typography variant="body2" color="text.secondary">
              Time: {lesson.meeting_time.slice(0, 5)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>

    {showApproveButton && (
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() =>
          onApprove(lesson.mentee_id, lesson.meeting_date)
        }
      >
        Approve
      </Button>
    )}
  </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Box>
                  {lesson.meeting_time && (
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Lessons;
