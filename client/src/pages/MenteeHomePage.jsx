import React, { useEffect, useState } from "react";
import axios from "axios";
import {TextField, Box, Grid, Typography, CircularProgress } from "@mui/material";
import MentorPreviewCard from "../components/MentorPreviewCard";

const MenteeHomePage = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const fetchMentors = async () => {
          try {
            const response = await axios.get("/api/users/mentee/home", {
              params: { name: searchTerm }
            });                        
            setMentors(response.data);
          } catch (err) {
            console.error("Error loading mentors:", err);
          } finally {
            setLoading(false);
          }
        };
        fetchMentors();
    }, []);
    const filteredMentors = mentors.filter((mentor) => {
      const fullName = `${mentor.first_name} ${mentor.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    }, [searchTerm]);
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find your Mentor
        </Typography>
        <TextField
          label="Search mentors by name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
              {filteredMentors.map((mentor) => (
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
