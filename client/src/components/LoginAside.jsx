import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function LoginAside() {
  return (
    <Paper
      elevation={8}
      sx={{
        height: "100%",
        borderRadius: 4,
        p: { xs: 3, md: 4 },
        background:
          "linear-gradient(180deg, rgba(251,113,133,0.10) 0%, rgba(244,114,182,0.12) 100%)",
        display: "flex",            // ⬅️ make Paper a flex column
        flexDirection: "column",
      }}
    >
      {/* TOP: title + copy (allowed to grow) */}
      <Box sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Typography
            variant="h3"
            className="sparkleText"
            sx={{ fontWeight: 900, letterSpacing: 1, mb: 1.5 }}
          >
            Queens Match
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Let’s start!
          </Typography>

          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Find your perfect <strong>mentor</strong> or <strong>mentee</strong>.
            In the next step you’ll be part of the <strong>Queen&nbsp;B</strong> community.
            You can log in as a mentor or a mentee and start learning—and
            giving back—to the community.
          </Typography>
        </Stack>
      </Box>

      {/* BOTTOM: CTA + social — anchored at the bottom */}
      <Box sx={{ pt: 2 /* space above footer */ }}>
        <Button
          variant="contained"
          color="secondary"
          endIcon={<OpenInNewIcon />}
          component="a"
          href="https://queenb.org.il/en/en-home/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ borderRadius: 3, alignSelf: "flex-start", mb: 1.5 }}
        >
          About QueenB
        </Button>

        <Stack direction="row" spacing={1.5}>
          <Tooltip title="LinkedIn">
            <IconButton
              component="a"
              href="https://www.linkedin.com/company/queenb/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="QueenB on LinkedIn"
            >
              <LinkedInIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Facebook">
            <IconButton
              component="a"
              href="https://www.facebook.com/queenb.program"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="QueenB on Facebook"
            >
              <FacebookIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Instagram">
            <IconButton
              component="a"
              href="https://www.instagram.com/queenbprogram?igsh=OTdiNXQ0dGR3cnZp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="QueenB on Instagram"
            >
              <InstagramIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Paper>
  );
}
