import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack
} from "@mui/material";
import axios from "axios";

const MenteeProfileEdit = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...profile });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
        const filteredData = Object.fromEntries(
            Object.entries(formData).filter(([_, v]) => v !== undefined && v !== null)
          );
        const response = await axios.put("/api/users/mentee/profile", filteredData);
        onSave(response.data);
    } catch (err) {
      console.error("Failed to update profile", err);
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#fff", boxShadow: 3, borderRadius: 2, p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Edit Profile
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="First Name"
          value={formData.first_name}
          onChange={handleChange("first_name")}
          fullWidth
        />
        <TextField
          label="Last Name"
          value={formData.last_name}
          onChange={handleChange("last_name")}
          fullWidth
        />
        <TextField
          label="Email"
          value={formData.email}
          onChange={handleChange("email")}
          fullWidth
        />
        <TextField
          label="Phone"
          value={formData.phone}
          onChange={handleChange("phone")}
          fullWidth
        />
        <TextField
          label="LinkedIn URL"
          value={formData.linkedin_url}
          onChange={handleChange("linkedin_url")}
          fullWidth
        />
        <TextField
          label="Region"
          value={formData.region}
          onChange={handleChange("region")}
          fullWidth
        />
        <TextField
          label="Short Description"
          value={formData.short_description}
          onChange={handleChange("short_description")}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="Image URL"
          value={formData.image_url}
          onChange={handleChange("image_url")}
          fullWidth
        />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default MenteeProfileEdit;
