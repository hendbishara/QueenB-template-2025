require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
require("./db"); /////////////////////////////*************

const app = express();
const PORT = process.env.PORT || 5000;
const pool = require("./db");

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// הגדלת מגבלת גוף הבקשה כדי לאפשר Base64 של תמונה
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// (רשות) הודעה ידידותית אם הגוף גדול מדי
app.use((err, req, res, next) => {
  if (err && err.type === "entity.too.large") {
    return res
      .status(413)
      .json({ error: "Image too large. Try a smaller one." });
  }
  next(err);
});

//RONTEST

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth")); //************* */

// Test route to verify database connectivity
// somewhere after the middlewares and before the 404 handler
app.get("/api/db-test", async (req, res) => {
  try {
    // Execute a simple query: 1 + 1 should return 2
    // If this works, it means the DB connection is active
    const [rows] = await pool.query("SELECT 1 + 1 AS result");

    // Send a JSON response with the result
    // Expected: { ok: true, db_result: 2 }
    res.json({ ok: true, db_result: rows[0].result });
  } catch (err) {
    // If something goes wrong (e.g., wrong DB credentials),
    // log the error and return a 500 response
    console.error("DB test failed:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

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
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
    stack: err.stack,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
