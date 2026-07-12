const db = require('../config/db');
const path = require('path');

exports.getReportsPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/reports.html'));
};

exports.getStudentPerformanceReportAPI = async (req, res) => {
    try {
        const { course } = req.query;
        
        const sql = `
            SELECT 
                s.id, 
                s.roll_no, 
                s.name, 
                s.course,
                COUNT(a.id) AS total_sessions,
                SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_sessions,
                ROUND((SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) / COUNT(a.id)) * 100, 1) AS attendance_percentage,
                m.exam_type,
                m.subject_1_marks,
                m.subject_2_marks,
                m.subject_3_marks,
                (m.subject_1_marks + m.subject_2_marks + m.subject_3_marks) AS total_marks
            FROM students s
            LEFT JOIN attendance a ON s.id = a.student_id
            LEFT JOIN marks m ON s.id = m.student_id
            WHERE s.course = ?
            GROUP BY s.id, m.exam_type
            ORDER BY s.roll_no ASC
        `;

        const [reportData] = await db.execute(sql, [course]);
        res.json({ success: true, data: reportData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to compile analytical summary sheets.' });
    }
};