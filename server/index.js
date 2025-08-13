require('dotenv').config();  

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRouter = require('./routes/auth');
const mentorRouter = require('./routes/mentor');
const menteeRouter = require('./routes/mentee');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//RONTEST
// Routes
app.use("/api/mentee", menteeRouter);
app.use("/api/auth", authRouter);  
app.use("/api/mentor", mentorRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "QueenB Server is running!",
    timestamp: new Date().toISOString(),
    status: "healthy",
  });
});

// Root endpoint
//app.get("/", (req, res) => {
//  res.json({ message: "Welcome to QueenB API" });
//});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
});
