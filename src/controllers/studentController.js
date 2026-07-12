const Student = require('../models/studentModel');
const path = require('path');

exports.getAddStudentPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/add-student.html'));
};

exports.handleAddStudent = async (req, res) => {
    try {
        const { roll_no, name, email, course } = req.body;
        await Student.create({ roll_no, name, email, course });
        res.json({ success: true, message: 'Student registered successfully!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.json({ success: false, message: 'Roll Number or Email already exists!' });
        }
        res.status(500).json({ success: false, message: 'Database error occurred.' });
    }
};

exports.getViewStudentsPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/view-students.html'));
};

exports.getAllStudentsAPI = async (req, res) => {
    try {
        const students = await Student.fetchAll();
        res.json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch student arrays.' });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, course } = req.body;
        await Student.updateById(id, name, email, course);
        res.json({ success: true, message: 'Student record updated successfully!' });
    } catch (err) {
        res.json({ success: false, message: 'Failed to update record.' });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const id = req.params.id;
        await Student.deleteById(id);
        res.json({ success: true, message: 'Student record dropped cleanly!' });
    } catch (err) {
        res.json({ success: false, message: 'Failed to execute deletion.' });
    }
};