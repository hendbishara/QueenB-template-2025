// import React from "react";
// import { Button } from "@mui/material";
// import { Link } from "react-router-dom"; // For navigation

// const Dashboard = () => {
//   return (
//     <div style={{ textAlign: "center", paddingTop: "20px" }}>
//       <h1>Welcome to the Dashboard!</h1>

//       {/*Link to the registration page*/}
//       <Link to="/register">
//         <Button
//           variant="contained"
//           color="primary"
//           style={{ marginTop: "20px" }}
//         >
//           Go to Registration
//         </Button>
//       </Link>
//     </div>
//   );
// };

// export default Dashboard;

import React from "react";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import UserManagement from "./UserManagement";

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            👑 QueenB - Example Bar
          </Typography>
        </Toolbar>
      </AppBar>
      <UserManagement />
    </Box>
  );
}

export default App;
