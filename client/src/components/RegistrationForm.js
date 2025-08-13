// import React from "react";
// import { TextField, Button, Box } from "@mui/material";

// const RegistrationForm = ({ userType }) => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         marginTop: 2,
//       }}
//     >
//       {/* Display different heading based on user type */}
//       <h2>
//         {userType === "mentor" ? "Mentor Registration" : "Mentee Registration"}
//       </h2>

//       {/* Render fields based on userType */}
//       {userType === "mentor" ? (
//         <>
//           <TextField label="Name" variant="outlined" sx={{ marginBottom: 2 }} />
//           <TextField
//             label="Skills/Technologies"
//             variant="outlined"
//             sx={{ marginBottom: 2 }}
//           />
//           <TextField
//             label="Years of Experience"
//             variant="outlined"
//             sx={{ marginBottom: 2 }}
//           />
//           <TextField
//             label="LinkedIn Profile"
//             variant="outlined"
//             sx={{ marginBottom: 2 }}
//           />
//         </>
//       ) : (
//         <>
//           <TextField label="Name" variant="outlined" sx={{ marginBottom: 2 }} />
//           <TextField
//             label="Email"
//             variant="outlined"
//             sx={{ marginBottom: 2 }}
//           />
//           <TextField
//             label="Phone"
//             variant="outlined"
//             sx={{ marginBottom: 2 }}
//           />
//         </>
//       )}

//       {/* Submit button */}
//       <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
//         Submit
//       </Button>
//     </Box>
//   );
// };

// export default RegistrationForm;
