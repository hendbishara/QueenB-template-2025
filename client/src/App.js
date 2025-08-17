import React from "react";
import {Routes, Route } from "react-router-dom";
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline
} from "@mui/material";

import Dashboard from "./components/Dashboard"; 
import MenteeHomePage from "./pages/MenteeHomePage";
import MenteeProfilePage from "./pages/MenteeProfilePage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f472b6",
    },
    secondary: {
      main: "#fb7185",
    },
    background: {
      default: "#fff0f5", 
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      color: "#333",
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mentee/home" element={<MenteeHomePage />} />
          <Route path="/mentee/profile" element={<MenteeProfilePage />} />
        </Routes>
    </ThemeProvider>
  );
}

export default App;
