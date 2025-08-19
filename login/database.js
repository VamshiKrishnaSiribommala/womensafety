const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',   // Your MySQL server
    user: 'root',        // Your MySQL username
    password: 'yourpassword',        // Your MySQL password (leave empty if none)
    database: 'vamshii'  // The database you created
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

module.exports = connection;
