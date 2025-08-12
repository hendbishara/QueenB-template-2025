import React from "react";
import { Button, Box } from "@mui/material";

// Component for selecting user type (mentor or mentee)
const UserTypeSelection = ({ setUserType }) => {
  const userTypes = [
    { label: "I am a Mentor", type: "mentor" },
    { label: "I am a Mentee", type: "mentee" },
  ];

  return (
    <Box>
      {userTypes.map((user) => (
        <Button
          key={user.type}
          variant="contained"
          color={user.type === "mentor" ? "primary" : "secondary"}
          sx={{ marginRight: 2 }}
          onClick={() => setUserType(user.type)} // Update userType state when button is clicked
        >
          {user.label}
        </Button>
      ))}
    </Box>
  );
};

export default UserTypeSelection;
