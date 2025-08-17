import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  if (loading) return null;

  let homePath = "/";
  if (user.isLoggedIn) {
    if (user.role === "mentee") {
      homePath = "/mentee/home";
    } else if (user.role === "mentor") {
      homePath = "/mentor/home";
    }
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #fce4ec",
        mb: 4,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 4 }}>
        <Box display="flex" alignItems="center">
          <img
            src="/logo.png"
            alt="Queens Match Logo"
            style={{ height:100 }} 
          />
        </Box>

        <Box display="flex" alignItems="center" gap={3}>
          <Button
            onClick={() => navigate(homePath)}
            sx={{ color: "#d63384", fontWeight: 600, fontSize: "1.25rem" }}
          >
            HOME
          </Button>

          {user.isLoggedIn ? (
            <>
              <Button
                component={Link}
                to={
                  user.role === "mentee"
                    ? "/mentee/profile"
                    : "/mentor/profile"
                }
                sx={{ color: "#d63384", fontWeight: 600, fontSize: "1.25rem" }}
              >
                MY PROFILE
              </Button>

              <Button
                component={Link}
                to="/logout"
                sx={{ color: "#d63384", fontWeight: 600, fontSize: "1.25rem" }}
              >
                LOGOUT
              </Button>

              <Typography
                variant="body1"
                sx={{
                    color: "#d63384",
                    fontWeight: 600,
                    fontSize: "1.5rem"
                }}
                >
                Hello, {user.name}
            </Typography>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                sx={{ color: "#d63384", fontWeight: 600, fontSize: "1.25rem" }}
              >
                LOGIN
              </Button>
              <Button
                component={Link}
                to="/register"
                sx={{ color: "#d63384", fontWeight: 600, fontSize: "1.25rem" }}
              >
                REGISTER
              </Button>
              <Typography
                variant="body1"
                sx={{
                    color: "#d63384",
                    fontWeight: 600,
                    fontSize: "1.5rem",
                    ml: 2,
                }}
                >
                Hello, {user.name}
            </Typography>

            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
