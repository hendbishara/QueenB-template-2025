import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline
} from "@mui/material";
import Dashboard from "./components/Dashboard";

import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* AuthProvider wraps the whole app so any page can read auth state */}
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public route: anyone can access */}
            <Route path="/login" element={<Login />} />

            {/* Private route: only logged-in users can access */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
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