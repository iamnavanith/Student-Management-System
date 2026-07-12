const Attendance = require('../models/attendanceModel');
const db = require('../config/db');
const path = require('path');

exports.getAttendancePage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/attendance.html'));
};

exports.getStudentsByCourseAPI = async (req, res) => {
    try {
        const { course } = req.query;
        const sql = 'SELECT id, roll_no, name FROM students WHERE course = ? ORDER BY roll_no ASC';
        const [students] = await db.execute(sql, [course]);
        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve course class list.' });
    }
};

exports.submitAttendanceAPI = async (req, res) => {
    try {
        const { date, records } = req.body;
        for (let record of records) {
            await Attendance.save(record.student_id, record.status, date);
        }
        res.json({ success: true, message: 'Daily attendance roster saved successfully!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to log tracking points.' });
    }
};