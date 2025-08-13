// import React, { useState } from "react";
// import { Box, Typography } from "@mui/material";
// import RegistrationForm from "./RegistrationForm"; // Import RegistrationForm component
// import UserTypeSelection from "./UserTypeSelection"; // Import UserTypeSelection component

// const RegistrationPage = () => {
//   const [userType, setUserType] = useState(null); // Track user type (mentor or mentee)

//   return (
//     <Box sx={{ textAlign: "center", paddingTop: "20px" }}>
//       <Typography variant="h4" gutterBottom>
//         Register for the coolest website in the universe!
//       </Typography>

//       {/* Render UserTypeSelection if no user type has been selected */}
//       {!userType ? (
//         <UserTypeSelection setUserType={setUserType} />
//       ) : (
//         // If userType is selected, render the registration form
//         <RegistrationForm userType={userType} />
//       )}
//     </Box>
//   );
// };

// export default RegistrationPage;
