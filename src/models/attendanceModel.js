const db = require('../config/db');

const Attendance = {
    save: async (student_id, status, date) => {
        const sql = `
            INSERT INTO attendance (student_id, status, attendance_date) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE status = ?
        `;
        const [result] = await db.execute(sql, [student_id, status, date, status]);
        return result;
    }
};

module.exports = Attendance;