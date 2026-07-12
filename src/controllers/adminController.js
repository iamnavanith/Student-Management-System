const db = require('../config/db');

// Display the Login Page
exports.getLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/login.html')); 
};

// Handle the Login Form Submission
exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the database to find the admin
        const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);

        if (rows.length > 0) {
            const admin = rows[0];
            
            // Check if the password matches directly
            if (password === admin.password) {
                // Success! Send a positive response
                return res.json({ success: true, message: 'Login successful!' });
            } else {
                // Wrong password
                return res.json({ success: false, message: 'Invalid password. Please try again.' });
            }
        } else {
            // Username not found
            return res.json({ success: false, message: 'Admin username not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};