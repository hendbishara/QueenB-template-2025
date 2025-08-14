import React from "react";
import { Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const ClearFiltersButton = ({ onClear }) => {
  return (
    <Button
      variant="outlined"
      color="secondary"
      startIcon={<ClearIcon />}
      onClick={onClear}
      sx={{ mt: 2 }}
    >
      Clear Filters
    </Button>
  );
};

export default ClearFiltersButton;