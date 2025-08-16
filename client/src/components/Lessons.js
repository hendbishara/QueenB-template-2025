import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

const Lessons = ({ menteeId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get(`/api/users/mentee/${menteeId}/lessons`);
        setLessons(response.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [menteeId]);

  if (loading) return <CircularProgress />;
  if (lessons.length === 0)
    return <Typography align="center">No lessons found.</Typography>;

  return (
    <Grid container spacing={2} justifyContent="center">
      {lessons.map((lesson, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Mentor: {lesson.mentor_name}
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <EventIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {new Date(lesson.meeting_date).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Lessons;
