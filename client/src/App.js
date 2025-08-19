import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

import Login from "./pages/Login";
import RegistrationPage from "./features/auth/RegistrationPage";
import Dashboard from "./components/Dashboard";
import MenteeHomePage from "./pages/MenteeHomePage";
import MenteeProfilePage from "./pages/MenteeProfilePage";
import MentorProfilePage from "./pages/MentorProfilePage";

import "./index.css";

import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";
import { useAuth } from "./auth/AuthContext";

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
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/mentee/home"
            element={
              <ProtectedRoute>
                <ProtectedRoute roles={["MENTEE"]}></ProtectedRoute>
                <MenteeHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentee/:id/profile"
            element={
              <ProtectedRoute roles={["MENTEE"]}>
                <MenteeProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mentor/:id/profile"
            element={
              <ProtectedRoute roles={["MENTOR"]}>
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
