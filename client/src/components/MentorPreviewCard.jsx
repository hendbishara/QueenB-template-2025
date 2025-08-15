import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import EmailButton from "./EmailButton";
import PhoneButton from "./PhoneButton";
import LinkedInButton from "./LinkedInButton";

const MentorPreviewCard = ({ mentor, onClickImage}) => {
  return (
    <Card sx={{ maxWidth: 300, m: "auto", p: 2 }}>
      <CardMedia
        component="img"
        height="180"
        image={mentor.image_url || "https://via.placeholder.com/300x180?text=Mentor"}
        alt={`${mentor.first_name} ${mentor.last_name}`}
        sx={{ cursor: "pointer" }}
        onClick={onClickImage}
      />
      <CardContent>
        <Typography variant="h6" component="div" align="center">
          {mentor.first_name} {mentor.last_name}
        </Typography>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={2}
          gap={1.2}
        >
          <EmailButton email={mentor.email} />
          <PhoneButton phone={mentor.phone} />
          <LinkedInButton url={mentor.linkedin_url} />
        </Box>
  
      </CardContent>
    </Card>
  );
};

export default MentorPreviewCard;
