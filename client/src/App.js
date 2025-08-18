import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Dashboard from "./components/Dashboard";

import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";

import RegistrationPage from "./features/auth/RegistrationPage";

import MenteeHomePage from "./pages/MenteeHomePage";
import MenteeProfilePage from "./pages/MenteeProfilePage";
import MentorProfilePage from "./pages/MentorProfilePage";

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
      {/* AuthProvider wraps the whole app so any page can read auth state */}
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public route: anyone can access */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegistrationPage />} />

            {/* Private route: only logged-in users can access */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                  <Route path="/mentee/home" element={<MenteeHomePage />} />
                  <Route
                    path="/mentee/profile"
                    element={<MenteeProfilePage />}
                  />
                  <Route
                    path="/mentor/profile"
                    element={<MentorProfilePage />}
                  />
                </ProtectedRoute>
              }
            />

            {/* Fallback: unknown paths -> go “home” (which is protected) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
