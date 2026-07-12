const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection immediately on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error('DATABASE CONNECTION FAILED!');
        console.error('Error Details: ' + err.message);
        console.log('Please check if your MySQL Server is running and your password in .env is correct.');
        return;
    }
    console.log('Database connection verified successfully!');
    connection.release();
});

// Export the pool so other files can run queries
module.exports = pool.promise();