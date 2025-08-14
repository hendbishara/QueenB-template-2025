import React from "react";
import { Button } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const LinkedInButton = ({ url }) => {
  return (
    <Button
      variant="outlined"
      color="info"
      startIcon={<LinkedInIcon />}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      LinkedIn
    </Button>
  );
};

export default LinkedInButton;
