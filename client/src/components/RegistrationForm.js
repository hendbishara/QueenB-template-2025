import React, { useState } from "react";
import { Button, Box, Typography, Grid, TextField } from "@mui/material";
import "./RegistrationForm.css"; // ייבוא הקובץ CSS

const RegistrationForm = ({ userType }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    technologies: "",
    yearsOfExperience: "",
    linkedIn: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <Box className="registration-container">
      <Typography className="registration-title">
        {userType === "mentor" ? "רישום כמנטורית" : "רישום כמנטית"}
      </Typography>
      <form onSubmit={handleSubmit} className="registration-form">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          {/* שאר השדות */}
        </Grid>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="registration-button"
        >
          Register
        </Button>
      </form>
    </Box>
  );
};

export default RegistrationForm;
