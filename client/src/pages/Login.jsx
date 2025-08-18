import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Visibility, VisibilityOff, LockOutlined } from "@mui/icons-material";

export default function Login() {
  // [1] Pull auth helpers and routing utilities
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/"; // go back where user intended

  // [2] Local form/UI state (controlled inputs + UI flags)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true); // UX only; see note below
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // [3] Lightweight client-side validation (UX only; server still validates)
  const validate = () => {
    if (!email.includes("@")) return "Please enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  // [4] Submit handler: validate → call backend via AuthContext → navigate
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setBusy(true);
      // calls POST /api/auth/login in AuthContext, saves token & user
      await login(email.trim(), password);

      // (Optional) “remember me”
      // For now we always use localStorage (persists). If you want true
      // "no remember", you can store token in sessionStorage when !remember.

      // send them back to where they tried to go (or "/")
      navigate(from, { replace: true });
    } catch (err) {
      const serverMsg = err?.response?.data?.error || "Login failed";
      setError(serverMsg);
    } finally {
      setBusy(false);
    }
  };

  return (
    // [5] Page background & centering (matches your soft design)
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg, #ffe5ec 0%, #f9d3dc 100%)",
        p: 2,
      }}
    >
      {/* [6] Content width: keeps the card nicely sized on all screens */}
      <Container maxWidth="sm">
        {/* [7] The card: visual container with rounded corners and shadow */}
        <Card elevation={8} sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            {/* [8] Small “brand” header area */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
    {/* NEW: QueenB logo above the lock */}
    <Box
        component="img"
        src="https://queenb.org.il/wp-content/uploads/2023/08/rainbow-1.png"
        alt="QueenB logo"
        sx={{
        width: 100,                  // adjust size to taste (e.g., 80–120)
        height: 100,
        objectFit: "contain",
        mx: "auto",
        mb: 1.5,                    // spacing below the logo
        display: "block",
        filter: "drop-shadow(0 4px 12px rgba(0,0,0,.12))" // subtle depth (optional)
        }}
    />

    <Typography variant="h5" className="sparkleText" sx={{ mb: 0.5 }}>
        Welcome to mentors and mentees matching
    </Typography>
    <Typography variant="body2" color="text.secondary">
        Sign in to Queens Match
    </Typography>
    </Box>


            {/* [9] The form itself */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
              {/* [10] Error from client validation or backend */}
              {error && <Alert severity="error">{error}</Alert>}

              {/* [11] Email field (controlled input) */}
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                fullWidth
                autoComplete="email"
                inputProps={{ "aria-label": "email" }}
              />

              {/* [12] Password field with visibility toggle */}
              <TextField
                label="Password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                fullWidth
                autoComplete="current-password"
                inputProps={{ "aria-label": "password" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPw((s) => !s)}
                        edge="end"
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* [13] Optional “remember me” checkbox (UX flag) */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    color="secondary"
                    inputProps={{ "aria-label": "remember me" }}
                  />
                }
                label="Remember me"
              />

              {/* [14] Submit button (disabled while busy) */}
              <Button
                variant="contained"
                color="secondary"
                size="large"
                type="submit"
                disabled={busy}
                sx={{ borderRadius: 3, py: 1.2, mt: 1 }}
              >
                {busy ? "Signing in…" : "Sign in"}
              </Button>

              {/* [15] Optional footer link */}
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Don’t have an account? <a href="/signup">Sign up</a>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

