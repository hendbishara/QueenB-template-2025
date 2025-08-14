import React from "react";
import { Button } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

const EmailButton = ({ email }) => {
  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<EmailIcon />}
      href={`mailto:${email}`}
    >
      Email
    </Button>
  );
};

export default EmailButton;
