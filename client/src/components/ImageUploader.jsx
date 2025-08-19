// import React, { useRef, useState } from "react";
// import { Avatar, Box, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
// import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

// const ImageUploader = ({ imageUrl, onImageChange }) => {
//   const fileInputRef = useRef(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [urlInput, setUrlInput] = useState("");

//   const handleAvatarClick = () => {
//     setDialogOpen(true);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       onImageChange(reader.result); // base64 URL
//       setDialogOpen(false);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handlePasteUrl = () => {
//     if (urlInput.trim()) {
//       onImageChange(urlInput.trim());
//       setDialogOpen(false);
//       setUrlInput("");
//     }
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           position: "relative",
//           width: 120,
//           height: 120,
//           mx: "auto",
//           "&:hover .overlay": { opacity: 1 },
//           cursor: "pointer"
//         }}
//         onClick={handleAvatarClick}
//       >
//         <Avatar
//           src={imageUrl}
//           sx={{ width: 120, height: 120 }}
//         />
//         <Box
//           className="overlay"
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             bgcolor: "rgba(0,0,0,0.4)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             opacity: 0,
//             transition: "opacity 0.3s ease-in-out",
//             borderRadius: "50%"
//           }}
//         >
//           <Tooltip title="Change Photo">
//             <IconButton sx={{ color: "#fff" }}>
//               <PhotoCameraIcon />
//             </IconButton>
//           </Tooltip>
//         </Box>
//       </Box>

//       {/* Dialog for upload or URL */}
//       <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
//         <DialogTitle>Update Profile Picture</DialogTitle>
//         <DialogContent>
//           <Button
//             variant="contained"
//             component="label"
//             fullWidth
//             sx={{ mb: 2 }}
//           >
//             Upload from Computer
//             <input
//               type="file"
//               hidden
//               accept="image/*"
//               ref={fileInputRef}
//               onChange={handleFileChange}
//             />
//           </Button>

//           <TextField
//             fullWidth
//             label="Paste Image URL"
//             value={urlInput}
//             onChange={(e) => setUrlInput(e.target.value)}
//             variant="outlined"
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
//           <Button variant="contained" onClick={handlePasteUrl}>
//             Use URL
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default ImageUploader;
import React, { useRef, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import api from "../api";

const ImageUploader = ({ imageUrl, onImageChange }) => {
  const fileInputRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const handleAvatarClick = () => {
    setDialogOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        await api.put("/users/mentee/profile", { image_url: base64 });
        onImageChange(base64);
        setDialogOpen(false);
      } catch (err) {
        console.error("Failed to update image from file", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePasteUrl = async () => {
    if (!urlInput.trim()) return;
    try {
      await api.put("/users/mentee/profile", { image_url: urlInput.trim() });
      onImageChange(urlInput.trim());
      setDialogOpen(false);
      setUrlInput("");
    } catch (err) {
      console.error("Failed to update image from URL", err);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: 120,
          height: 120,
          mx: "auto",
          "&:hover .overlay": { opacity: 1 },
          cursor: "pointer"
        }}
        onClick={handleAvatarClick}
      >
        <Avatar
          src={imageUrl}
          sx={{ width: 120, height: 120 }}
        />
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.3s ease-in-out",
            borderRadius: "50%"
          }}
        >
          <Tooltip title="Change Photo">
            <IconButton sx={{ color: "#fff" }}>
              <PhotoCameraIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mb: 2 }}
          >
            Upload from Computer
            <input
              type="file"
              hidden
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </Button>

          <TextField
            fullWidth
            label="Paste Image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePasteUrl}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImageUploader;
