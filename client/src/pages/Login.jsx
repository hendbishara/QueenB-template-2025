import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import LoginAside from "../components/LoginAside";

export default function Login() {
  // Auth + navigation
  const { login } = useAuth();
  const navigate = useNavigate();

  // Local state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Simple client validation
  const validate = () => {
    if (!email.includes("@")) return "Please enter a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  };

  // Submit → login → role-based redirect
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

      // POST /api/auth/login via AuthContext (returns user)
      const user = await login(email.trim(), password);

      const role = (user?.role || "").toUpperCase();
      const destination =
        role === "MENTOR"
          ? `/mentor/${user.id}/profile`
          : role === "MENTEE"
          ? `/mentee/home`
          : "/";

      navigate(destination, { replace: true });
    } catch (err) {
      const serverMsg = err?.response?.data?.error || "Login failed";
      setError(serverMsg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(180deg, #ffe5ec 0%, #f9d3dc 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="stretch">
          {/* LEFT: About/Community panel */}
          <Grid item xs={12} md={6}>
            <LoginAside />
          </Grid>

          {/* RIGHT: Login card */}
          <Grid item xs={12} md={6}>
            <Card elevation={8} sx={{ borderRadius: 4, height: "100%" }}>
              <CardContent sx={{ p: 4 }}>
                {/* Brand header */}
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Box
                    component="img"
                    src="/logo.png"
                    alt="QueenB logo"
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: "contain",
                      mx: "auto",
                      mb: 1.5,
                      display: "block",
                      filter: "drop-shadow(0 4px 12px rgba(0,0,0,.12))",
                    }}
                  />
                  <Typography variant="h5" className="sparkleText" sx={{ mb: 0.5 }}>
                    Welcome to mentors and mentees matching
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in to Queens Match
                  </Typography>
                </Box>

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
                  {error && <Alert severity="error">{error}</Alert>}

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

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/register")}
                  >
                    Don’t have an account? <strong>Sign up</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}