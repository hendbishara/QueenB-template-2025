import React from "react";
import { Button } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

const PhoneButton = ({ phone }) => {
  return (
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<PhoneIcon />}
      href={`tel:${phone}`}
    >
      Call
    </Button>
  );
};

export default PhoneButton;
