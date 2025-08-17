import React from "react";
import { IconButton } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

const PhoneButton = ({ phone }) => {
  return (
    <IconButton
      href={`tel:${phone}`}
      sx={{
        border: "2px solid #ec4899",
        borderRadius: "50%",
        width: 50,
        height: 50,
        color: "#ec4899",
        "&:hover": {
          backgroundColor: "#fce4ec"
        }
      }}
    >
      <PhoneIcon fontSize="medium" />
    </IconButton>
  );
};

export default PhoneButton;
