import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import MentorPreviewCard from "../components/MentorPreviewCard";

const MenteeHomePage = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchMentors = async () => {
          try {
            const response = await axios.get("/api/users/mentee/home");
            setMentors(response.data);
          } catch (err) {
            console.error("Error loading mentors:", err);
          } finally {
            setLoading(false);
          }
        };
        fetchMentors();
    }, []);
    return (
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Find your Mentor👩‍💻
          </Typography>
    
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {mentors.map((mentor) => (
                <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                  <MentorPreviewCard mentor={mentor} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      );

};  

export default MenteeHomePage;
