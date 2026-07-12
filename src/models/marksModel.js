const db = require('../config/db');

const Marks = {
    save: async (student_id, exam_type, s1, s2, s3) => {
        const sql = `
            INSERT INTO marks (student_id, exam_type, subject_1_marks, subject_2_marks, subject_3_marks) 
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                subject_1_marks = ?, 
                subject_2_marks = ?, 
                subject_3_marks = ?
        `;
        const [result] = await db.execute(sql, [student_id, exam_type, s1, s2, s3, s1, s2, s3]);
        return result;
    }
};

module.exports = Marks;