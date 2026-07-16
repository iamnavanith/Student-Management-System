const db = require('../config/db');

// In-memory OTP store: { phone: { otp, expiresAt } }
const otpStore = {};

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

// Handle Account Registration
exports.postRegister = async (req, res) => {
    const { fullname, username, email, phone, password } = req.body;

    // Basic server-side validation
    if (!fullname || !username || !email || !password) {
        return res.json({ success: false, message: 'All required fields must be filled.' });
    }

    if (password.length < 6) {
        return res.json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    try {
        // Check if username already exists
        const [existing] = await db.execute('SELECT id FROM admins WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.json({ success: false, message: 'Username already exists. Please choose another.' });
        }

        // Check if email already exists
        const [existingEmail] = await db.execute('SELECT id FROM admins WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            return res.json({ success: false, message: 'Email already registered. Please use a different email.' });
        }

        // Insert new admin
        await db.execute(
            'INSERT INTO admins (fullname, username, email, phone, password) VALUES (?, ?, ?, ?, ?)',
            [fullname, username, email, phone || null, password]
        );

        return res.json({ success: true, message: 'Account created successfully! You can now sign in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
};

// Send OTP to phone number (simulated)
exports.sendPhoneOTP = async (req, res) => {
    const { phone } = req.body;

    if (!phone || phone.length < 10) {
        return res.json({ success: false, message: 'Please enter a valid phone number.' });
    }

    try {
        // Check if phone number exists in the database
        const [rows] = await db.execute('SELECT id FROM admins WHERE phone = ?', [phone]);
        if (rows.length === 0) {
            return res.json({ success: false, message: 'No account found with this phone number. Please register first.' });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

        // Store OTP in memory
        otpStore[phone] = { otp, expiresAt };

        // Log to server console (simulated SMS)
        console.log('');
        console.log('═══════════════════════════════════════════');
        console.log('  📱 OTP SENT (Simulated SMS)');
        console.log('  Phone: ' + phone);
        console.log('  OTP Code: ' + otp);
        console.log('  Expires in: 5 minutes');
        console.log('═══════════════════════════════════════════');
        console.log('');

        return res.json({ 
            success: true, 
            message: 'OTP sent successfully!',
            // Include OTP in response for demo purposes (remove in production)
            demo_otp: otp
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    }
};

// Verify OTP and authenticate
exports.verifyPhoneOTP = async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.json({ success: false, message: 'Phone and OTP are required.' });
    }

    const stored = otpStore[phone];

    if (!stored) {
        return res.json({ success: false, message: 'No OTP was sent to this number. Please request a new one.' });
    }

    if (Date.now() > stored.expiresAt) {
        delete otpStore[phone];
        return res.json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (otp !== stored.otp) {
        return res.json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    // OTP is valid, clean up and authenticate
    delete otpStore[phone];

    try {
        const [rows] = await db.execute('SELECT * FROM admins WHERE phone = ?', [phone]);
        if (rows.length > 0) {
            return res.json({ success: true, message: 'Phone verified! Login successful.' });
        } else {
            return res.json({ success: false, message: 'Account not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during verification.' });
    }
};

// Google Sign-In handler (simulated)
exports.googleLogin = async (req, res) => {
    const { email, name, googleId } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Google authentication failed. No email received.' });
    }

    try {
        // Check if user already exists with this email
        const [rows] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);

        if (rows.length > 0) {
            // User exists, log them in
            return res.json({ success: true, message: 'Google Sign-In successful! Welcome back.' });
        } else {
            // Auto-create account for Google user
            const username = email.split('@')[0] + '_g';
            await db.execute(
                'INSERT INTO admins (fullname, username, email, password, google_id) VALUES (?, ?, ?, ?, ?)',
                [name || 'Google User', username, email, 'GOOGLE_AUTH_' + Date.now(), googleId || null]
            );
            return res.json({ success: true, message: 'Google Sign-In successful! Account created automatically.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during Google authentication.' });
    }
};