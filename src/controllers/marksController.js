const Marks = require('../models/marksModel');
const path = require('path');

exports.getMarksPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/marks-entry.html'));
};

exports.submitMarksAPI = async (req, res) => {
    try {
        const { exam_type, marks_records } = req.body;
        
        for (let record of marks_records) {
            await Marks.save(record.student_id, exam_type, record.s1, record.s2, record.s3);
        }
        
        res.json({ success: true, message: 'Academic marks ledger updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to record entries to database.' });
    }
};