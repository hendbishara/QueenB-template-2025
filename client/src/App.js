import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
} from "@mui/material";
import Dashboard from "./components/Dashboard"; // Assuming this is your home/dashboard component
import RegistrationForm from "./components/RegistrationForm"; // Import the registration form component
import UserTypeSelection from "./components/UserTypeSelection"; // Import the user type selection component

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
    },
    secondary: {
      main: "#ec4899",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function App() {
  const [userType, setUserType] = useState(null); // State to track user type (mentor or mentee)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ textAlign: "center", paddingTop: "20px" }}>
          <Typography variant="h4" gutterBottom>
            Registration for the coolest website in the universe!
          </Typography>

          {/* User type selection buttons */}
          <UserTypeSelection setUserType={setUserType} />

          {/* Render the registration form when a user type is selected */}
          {userType && (
            <Box sx={{ marginTop: 4 }}>
              <RegistrationForm userType={userType} />
            </Box>
          )}

          {/* Route for dashboard */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
