const mysql = require("mysql2/promise");

// Create a connection pool to MySQL
const pool = mysql.createPool({
  host: "localhost", 
  user: "root",
  password: "ron12345",
  database: "mentorship_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
