import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Lessons from "../components/Lessons";
import MenteeProfileEdit from "../components/MenteeProfileEdit";
import ImageUploader from "../components/ImageUploader";
import axios from "axios";
import {
  Typography,
  Avatar,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

const MenteeProfilePage = () => {
  const [mentee, setMentee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/users/mentee/profile");
        setMentee(response.data);
      } catch (err) {
        console.error("Failed to fetch mentee profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!mentee) {
    return (
      <>
        <Navbar />
        <Box display="flex" justifyContent="center" mt={5}>
          <Typography variant="h6">Mentee profile not found.</Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ maxWidth: "1000px", mx: "auto", mt: 5, px: 3 }}>
        {isEditing ? (
          <MenteeProfileEdit
            profile={mentee}
            onClose={() => setIsEditing(false)}
            onSave={async () => {
              try {
                const res = await axios.get("/api/users/mentee/profile");
                setMentee(res.data);
              } catch (err) {
                console.error("Failed to refresh profile after update", err);
              } finally {
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              gap: 4,
              alignItems: "flex-start",
              flexWrap: "wrap",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              boxShadow: 3,
              borderRadius: 2,
              p: 4,
            }}
          >
            <Tooltip title="Edit Profile">
              <IconButton
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "#6366f1",
                }}
                onClick={() => setIsEditing(true)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Box sx={{ textAlign: "center", minWidth: 250 }}>
              
              <ImageUploader
                open={showImageUploader}
                imageUrl={mentee.image_url}
                onImageChange={(newUrl) => {
                  setMentee((prev) => ({ ...prev, image_url: newUrl }));
                  setShowImageUploader(false);
                }}
                onClose={() => setShowImageUploader(false)}
              />
              <Typography variant="h5" gutterBottom>
                {mentee.first_name} {mentee.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mentee.short_description || "No description provided."}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Email:</strong> {mentee.email}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Phone:</strong> {mentee.phone}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Region:</strong> {mentee.region || "Not specified"}
              </Typography>
              <Typography variant="subtitle1">
                <strong>LinkedIn:</strong> {mentee.linkedin_url}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Box mt={4}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          centered
        >
          <Tab label="Past Meetings" />
          <Tab label="Upcoming Meetings" />
          <Tab label="Pending Meetings" />
        </Tabs>

        <Divider sx={{ my: 2 }} />

        {activeTab === 0 && (
          <Lessons
            userId={mentee.id}
            apiPath="lessons"
            emptyMessage="No past lessons found."
          />
        )}
        {activeTab === 1 && (
          <Lessons
          userId={mentee.id}
          apiPath="lessons"
          emptyMessage="No past lessons found."
        />
        )}
        {activeTab === 2 && (
          <Lessons
            userId={mentee.id}
            apiPath="lessons"
            emptyMessage="No past lessons found."
          />
        )}
      </Box>
    </>
  );
};

export default MenteeProfilePage;
