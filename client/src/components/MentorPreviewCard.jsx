// import React from "react";
// import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
// import EmailButton from "./EmailButton";
// import PhoneButton from "./PhoneButton";
// import LinkedInButton from "./LinkedInButton";

// const MentorPreviewCard = ({ mentor, onClickImage}) => {
//   return (
//     <Card sx={{ maxWidth: 300, m: "auto", p: 2 }}>
//       <CardMedia
//         component="img"
//         height="180"
//         image={mentor.image_url || "https://via.placeholder.com/300x180?text=Mentor"}
//         alt={`${mentor.first_name} ${mentor.last_name}`}
//         sx={{ cursor: "pointer" }}
//         onClick={onClickImage}
//       />
//       <CardContent>
//         <Typography variant="h6" component="div" align="center">
//           {mentor.first_name} {mentor.last_name}
//         </Typography>

//         <Box
//           display="flex"
//           flexDirection="row"
//           justifyContent="center"
//           alignItems="center"
//           mt={2}
//           gap={2}   
//         >
//           <EmailButton email={mentor.email} />
//           <PhoneButton phone={mentor.phone} />
//           <LinkedInButton url={mentor.linkedin_url} />
//         </Box>

  
//       </CardContent>
//     </Card>
//   );
// };

// export default MentorPreviewCard;
import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import EmailButton from "./EmailButton";
import PhoneButton from "./PhoneButton";
import LinkedInButton from "./LinkedInButton";

const MentorPreviewCard = ({ mentor, onClickImage }) => {
  return (
    <Card
      sx={{
        width: 260,
        height: 340,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        m: "auto",
        p: 2,
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ position: "relative", height: 160, overflow: "hidden", borderRadius: 2 }}>
        <CardMedia
          component="img"
          image={
            mentor.image_url ||
            "https://via.placeholder.com/300x180?text=Mentor"
          }
          alt={`${mentor.first_name} ${mentor.last_name}`}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={onClickImage}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.4)",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0,
            transition: "opacity 0.3s",
            "&:hover": {
              opacity: 1,
            },
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "bold",
            textAlign: "center",
            px: 1,
          }}
          onClick={onClickImage}
        >
          Click to schedule
        </Box>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 1.5,
        }}
      >
        <Typography variant="subtitle1" align="center">
          {mentor.first_name} {mentor.last_name}
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={1}
          gap={1.5}
        >
          <EmailButton email={mentor.email} />
          <PhoneButton phone={mentor.phone} />
          <LinkedInButton url={mentor.linkedin_url} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MentorPreviewCard;
