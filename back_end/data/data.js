// Database connection using mysql2
const sql = require('mysql2');
// Load DB credentials from .env
require('dotenv').config();

// Create a connection using environment variables or defaults
const connection = sql.createConnection({
  host: process.env.DB_HOST || 'localhost:3006',
  user: process.env.DB_USER || 'root1',
  password: process.env.DB_PASSWORD || 'secretpassword',
  database: process.env.DB_NAME || 'atelier_DB',
  port: process.env.DB_PORT || 3010
});

// Connect and log status
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

module.exports = connection;