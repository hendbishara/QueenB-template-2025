import React from "react";
import { Button, Box } from "@mui/material";

// רכיב לבחירת סוג המשתמש (מנטורית / מנטית)
const UserTypeSelection = ({ setUserType }) => {
  const userTypes = [
    { label: "אני מנטורית", type: "mentor" },
    { label: "אני מנטית", type: "mentee" },
  ];

  return (
    <Box>
      {userTypes.map((user) => (
        <Button
          key={user.type}
          variant="contained"
          color={user.type === "mentor" ? "primary" : "secondary"}
          sx={{ marginRight: 2 }}
          onClick={() => setUserType(user.type)}
        >
          {user.label}
        </Button>
      ))}
    </Box>
  );
};

export default UserTypeSelection;
