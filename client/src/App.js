import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import Login from "./pages/Login";
import RegistrationPage from "./features/auth/RegistrationPage";
import Dashboard from "./components/Dashboard";
import MenteeHomePage from "./pages/MenteeHomePage";
import MenteeProfilePage from "./pages/MenteeProfilePage";
import MentorProfilePage from "./pages/MentorProfilePage";

import './index.css';


import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";

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
    h4: { fontWeight: 700 },
    h6: { fontWeight: 500 },
    body1: { color: "#333" },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentee/home"
            element={
              <ProtectedRoute>
                <MenteeHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentee/profile"
            element={
              <ProtectedRoute>
                <MenteeProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/profile"
            element={
              <ProtectedRoute>
                <MentorProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
