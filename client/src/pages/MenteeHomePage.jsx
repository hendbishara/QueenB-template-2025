import React, { useEffect, useState } from "react";
import axios from "axios";
import {TextField, Box, Grid, Typography, CircularProgress ,Slider, Autocomplete, Chip } from "@mui/material";
import MentorPreviewCard from "../components/MentorPreviewCard";
import Navbar from "../components/Navbar";

const MenteeHomePage = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [region, setRegion] = useState("");
    const [experience, setExperience] = useState("");
    const [skills, setSkills] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [allSkills, setAllSkills] = useState([]);

    useEffect(() => {
      const fetchMentors = async () => {
        setLoading(true);
        try {
          const response = await axios.get("/api/users/mentee/home", {
            params: {
              name: searchTerm,
              region,
              experience,
              skills
            },
          });
          setMentors(response.data);
        } catch (err) {
          console.error("Error loading mentors:", err);
        } finally {
          setLoading(false);
        }
      };
    
      fetchMentors();
    }, [searchTerm, region, experience, skills]);
    
    useEffect(() => {
      const fetchSkills = async () => {
        try {
          const response = await axios.get("/api/users/skills");
          setAllSkills(response.data);
        } catch (error) {
          console.error("Error fetching skills:", error);
        }
      };
      fetchSkills();
    }, []);
    
    const filteredMentors = mentors.filter((mentor) => {
      const fullName = `${mentor.first_name} ${mentor.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    return (
      <>
      <Navbar/>
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
        <Autocomplete
          multiple
          options={allSkills}
          getOptionLabel={(option) => option}
          value={selectedSkills}
          onChange={(event, newValue) => {
            setSelectedSkills(newValue);
            setSkills(newValue.join(",")); // זה מה שנשלח ל־API
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Skills"
              placeholder="Choose skills"
              margin="normal"
            />
          )}
        />

        <Box sx={{ width: 300 }}>
        <TextField
          label="Region"
          select
          fullWidth
          margin="dense"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          size="small"
          SelectProps={{ native: true }}
        >
          <option value=""></option>
          <option value="North">North</option>
          <option value="Center">Center</option>
          <option value="South">South</option>
        </TextField>
        </Box>

        <Typography gutterBottom>Years of Experience</Typography>
        <Box sx={{ width: 300 }}>
          <Slider
            value={Number(experience)}
            onChange={(e, val) => setExperience(val)}
            aria-labelledby="experience-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={25}
          />
        </Box>
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
    </>
      );

};  

export default MenteeHomePage;
