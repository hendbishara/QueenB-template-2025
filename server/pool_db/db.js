// server/pool_db/db.js

// Import the MySQL library with Promise support (async/await)
// We use 'mysql2/promise' instead of plain 'mysql' for cleaner async code
const mysql = require("mysql2/promise");

// Create a connection pool
// A pool manages multiple DB connections and reuses them
// instead of opening/closing a new one every time — better performance & stability
const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1", // The DB server location (e.g., localhost)
  user: process.env.DB_USER || "root", // MySQL username
  password: process.env.DB_PASSWORD || "Mysq35ro@sh", // MySQL password
  database: process.env.DB_NAME || "mentorship_db", // Database/schema name
  waitForConnections: true, // Wait instead of throwing error if pool is full
  connectionLimit: 10, // Max connections at the same time
  queueLimit: 0, // 0 = unlimited waiting requests
});

// Simple connection test
(async () => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    console.log("✅ DB Connected. Test result:", rows[0].result); // should print 2
  } catch (err) {
    console.error("❌ DB Connection failed:", err.message);
  }
})();

// Export the pool so it can be imported in services/routes
// Example usage:
// const pool = require('../pool_db/db');
// const [rows] = await pool.execute('SELECT * FROM mentors');
module.exports = pool;
