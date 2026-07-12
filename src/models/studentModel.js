const db = require('../config/db');

const Student = {
    create: async (studentData) => {
        const { roll_no, name, email, course } = studentData;
        const sql = 'INSERT INTO students (roll_no, name, email, course) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(sql, [roll_no, name, email, course]);
        return result;
    },
    fetchAll: async () => {
        const sql = 'SELECT * FROM students ORDER BY id DESC';
        const [rows] = await db.execute(sql);
        return rows;
    },
    updateById: async (id, name, email, course) => {
        const sql = 'UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?';
        const [result] = await db.execute(sql, [name, email, course, id]);
        return result;
    },
    deleteById: async (id) => {
        const sql = 'DELETE FROM students WHERE id = ?';
        const [result] = await db.execute(sql, [id]);
        return result;
    }
};

module.exports = Student;