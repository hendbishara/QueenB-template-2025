// server/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ron12345',
  database: process.env.DB_NAME || 'mentorship_db',
  connectionLimit: 10
});

module.exports = pool;
