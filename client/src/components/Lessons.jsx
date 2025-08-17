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

const Lessons = ({
  userId,
  role = "mentee",
  apiPath,
  emptyMessage,
  showApproveButton = false,
  onApprove,
  refresh = 0,
}) => {
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
  }, [userId, role, apiPath, refresh]);

  if (loading) return <CircularProgress />;
  if (lessons.length === 0)
    return <Typography align="center">{emptyMessage}</Typography>;

  return (
    <Grid container spacing={2} justifyContent="center">
      {lessons.map((lesson, index) => (
        <Grid item key={index}>
          <Card elevation={3} sx={{ width: 350, minHeight: 140, px: 2, py: 1.5 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
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
                      <Typography variant="body2" color="text.secondary">
                        Time:{" "}
                        {lesson.meeting_time
                          ? lesson.meeting_time.slice(0, 5)
                          : "Not specified"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {showApproveButton && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      const dateOnly = lesson.meeting_date.slice(0, 10);
                      console.log("Clicked Approve for", {
                        ...lesson,
                        meeting_date: dateOnly,
                      });

                      onApprove(
                        lesson.mentee_id,
                        lesson.meeting_date,
                        lesson.meeting_time
                      );
                    }}
                  >
                    Approve
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Lessons;
