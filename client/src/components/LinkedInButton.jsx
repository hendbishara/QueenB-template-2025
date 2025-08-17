import React from "react";
import { IconButton } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const LinkedInButton = ({ url }) => {
  return (
    <IconButton
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        border: "2px solid #0077b5",
        borderRadius: "50%",
        width: 50,
        height: 50,
        color: "#0077b5",
        "&:hover": {
          backgroundColor: "#e6f2f8"
        }
      }}
    >
      <LinkedInIcon fontSize="medium" />
    </IconButton>
  );
};

export default LinkedInButton;
