import React, { useEffect, useState } from "react";
import axios from "axios";
import {TextField, Box, Grid, Typography, CircularProgress ,Slider, Autocomplete, Chip } from "@mui/material";
import MentorPreviewCard from "../components/MentorPreviewCard";
import Navbar from "../components/Navbar";
import ClearFiltersButton from "../components/ClearFiltersButton";
import MentorFullCard from "../components/MentorFullCard";

const MenteeHomePage = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [region, setRegion] = useState("");
    const [experience, setExperience] = useState("");
    const [skills, setSkills] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [allSkills, setAllSkills] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [showFullCard, setShowFullCard] = useState(false);
    
    
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
    const clearFilters = () => {
      setSearchTerm("");
      setRegion("");
      setExperience(0);
      setSelectedSkills([]);
      setSkills("");
    };
    const openMentorCard = async (mentorPreview) => {
      try {
        const response = await axios.get(`/api/users/mentors/${mentorPreview.id}`);
        setSelectedMentor(response.data);
        setShowFullCard(true);
      } catch (err) {
        console.error("Error loading mentor detail:", err);
      }
    };
    
    const closeMentorCard = () => {
      setShowFullCard(false);
      setSelectedMentor(null);
    };
    
    return (
      <>
      <Navbar/>
      <Box sx={{
        maxWidth: "1000px",
        mx: "auto",   
        textAlign:"center", 
        px: 4,
        py: 4
      }} >
        <Typography
          variant="h3"
          align="center"
          sx={{ color: "#d63384", fontWeight: 900, mb: 3 }}
        >
          Search & Match
        </Typography>
        <Box
          sx={{
            width: "100%",
            maxWidth: 800,
            mx: "auto",         
            textAlign: "center" 
          }}
        >       
         <TextField
          label="Search mentors by name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ backgroundColor: "#fff", borderRadius: 1 }}
        />

          <Autocomplete
            multiple
            options={allSkills}
            getOptionLabel={(option) => option}
            value={selectedSkills}
            onChange={(event, newValue) => {
              setSelectedSkills(newValue);
              setSkills(newValue.join(",")); 
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
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: 1
                }}
                />
            )}
          />
        </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 18,
              mt: 2
            }}
          >
            <Box sx={{ width: 400 }}>
              <Autocomplete
                options={["North", "Center", "South"]}
                value={region}
                onChange={(event, newValue) => {
                  setRegion(newValue || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Region"
                    margin="normal"
                    variant="outlined"
                    sx={{
                      backgroundColor: "#ffffff",
                      borderRadius: 1
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ width: 250 }}>
              <Typography gutterBottom>Years of Experience</Typography>
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
          </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4} >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
              {filteredMentors.map((mentor) => (
                <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                  <MentorPreviewCard mentor={mentor} onClickImage={() => openMentorCard(mentor)} />
                </Grid>
            ))}
          </Grid>
        )}

      </Box>
      <MentorFullCard
        open={showFullCard}
        onClose={closeMentorCard}
        mentor={selectedMentor}
      />
    </>
    
  );

};  

export default MenteeHomePage;
