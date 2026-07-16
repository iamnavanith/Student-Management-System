const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/adminController');

// 1. Route for Login Page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/login.html'));
});

// 2. Route for Login Submission (Username/Password)
router.post('/login', adminController.postLogin);

// 3. Route for Registration Page
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/register.html'));
});

// 4. Route for Registration Submission
router.post('/register', adminController.postRegister);

// 5. Route for Phone OTP - Send
router.post('/login/phone-send-otp', adminController.sendPhoneOTP);

// 6. Route for Phone OTP - Verify
router.post('/login/phone-verify-otp', adminController.verifyPhoneOTP);

// 7. Route for Google Sign-In
router.post('/login/google', adminController.googleLogin);

// 8. Route for Dashboard Page
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/dashboard.html'));
});

module.exports = router;