import React from "react";
import { IconButton } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const EmailButton = ({ email }) => {
  return (
    <IconButton
      href={`mailto:${email}`}
      sx={{
        border: "2px solid #d63384",
        borderRadius: "50%",
        width: 50,
        height: 50,
        color: "#d63384",
        "&:hover": {
          backgroundColor: "#fce4ec"
        }
      }}
    >
      <EmailIcon fontSize="medium" />
    </IconButton>
  );
};

export default EmailButton;
