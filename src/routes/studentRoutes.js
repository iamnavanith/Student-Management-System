const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const attendanceController = require('../controllers/attendanceController');
const marksController = require('../controllers/marksController');
const reportController = require('../controllers/reportController');

// Module 3, 4 & 5 Core Student Profile Directories Links
router.get('/add-student', studentController.getAddStudentPage);
router.post('/add-student', studentController.handleAddStudent);
router.get('/view-students', studentController.getViewStudentsPage);
router.get('/api/students', studentController.getAllStudentsAPI);
router.put('/api/students/update/:id', studentController.updateStudent);
router.delete('/api/students/delete/:id', studentController.deleteStudent);

// Module 6: Attendance Processing 
router.get('/attendance', attendanceController.getAttendancePage);
router.get('/api/attendance/students', attendanceController.getStudentsByCourseAPI);
router.post('/api/attendance/submit', attendanceController.submitAttendanceAPI);

// Module 7: Academic Marks Entries
router.get('/marks-entry', marksController.getMarksPage);
router.post('/api/marks/submit', marksController.submitMarksAPI);

// Module 8: Comprehensive Summary Analytics Report Cards
router.get('/reports', reportController.getReportsPage);
router.get('/api/reports/summary', reportController.getStudentPerformanceReportAPI);

module.exports = router;