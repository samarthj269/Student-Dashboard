const express = require('express');
const Student = require('./student'); 
const router = express.Router();


router.post('/api/students', async (req, res) => {
    try {
        
        if (!req.body.Email_Id) {
            return res.status(400).json({ message: 'Email_Id is required.' });
        }

        
        if (req.body.Date_of_Session) {
            const sessionDateParts = req.body.Date_of_Session.split("-");
            req.body.Date_of_Session = new Date(`${sessionDateParts[2]}-${sessionDateParts[1]}-${sessionDateParts[0]}`);
        }
        
        if (req.body.Date) {
            const dateParts = req.body.Date.split("-");
            req.body.Date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        }

        
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (error) {
       
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already exists.' });
        }
        res.status(400).json({ message: error.message });
    }
});


router.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
