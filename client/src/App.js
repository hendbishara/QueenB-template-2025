import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router components
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Dashboard from "./components/Dashboard"; // Import Dashboard component
//import RegistrationPage from "./pages/RegistrationPage"; // Import RegistrationPage component
import RegistrationPage from "./features/auth/RegistrationPage";

const theme = createTheme({
  palette: {
    primary: { main: "#6366f1" },
    secondary: { main: "#ec4899" },
    background: { default: "#f8fafc" },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
