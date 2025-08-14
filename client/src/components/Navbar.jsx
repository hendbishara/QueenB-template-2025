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
    <AppBar position="static" color="default" sx={{ mb: 4 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo / Title */}
        <Typography variant="h6" component="div">
          QueenB
        </Typography>

        <Box>
            {/* Home - Always visible */}
            <Button color="inherit" onClick={() => navigate(homePath)} sx={{ color: "#000" }}>
                Home
            </Button>

            {/* Conditional rendering based on user role */}
            {user.isLoggedIn ? (
                <>
                {user.role === "mentee" && (
                    <>
                        <Button
                            color="inherit"
                            component={Link}
                            to={user.role === "mentee" ? "/mentee/profile" : "/mentor/profile"}>
                            My Profile
                        </Button>

                    </>
                )}
                {user.role === "mentor" && (
                    <>
                    <Button color="inherit" component={Link} to="/mentor/profile">
                        My Profile
                    </Button>
                    </>
                )}
                <Button color="inherit" component={Link} to="/logout">
                    Logout
                </Button>
                <Typography variant="body1" sx={{ ml: 2, color: "#000", display: "inline" }}>
                    Hello, {user.name}
                </Typography>
                </>
            ) : (
                <>
                <Button color="inherit" component={Link} to="/login">
                    Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                    Register
                </Button>
                <Typography variant="body1" sx={{ ml: 2, color: "#000", display: "inline" }}>
                    Hello, Guest
                </Typography>
                </>
            )}
        </Box>


      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
