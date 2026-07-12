const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/adminController');

// 1. Route for Login Page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/login.html'));
});

// 2. Route for Login Submission
router.post('/login', adminController.postLogin);

// 3. Route for Dashboard Page
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/dashboard.html'));
});

module.exports = router;