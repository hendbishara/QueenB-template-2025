// server/db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mentorship_db",
  connectionLimit: 10,
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

module.exports = pool;
