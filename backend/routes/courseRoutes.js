// const express = require('express');
// const router = express.Router();
// const Student = require('../models/Student');  // Student model
// const Course = require('../models/Course');    // Course model

// // GET route to retrieve student and course details
// router.get('/:studentId', async (req, res) => {
//   try {
//     const student = await Student.findOne({ student_id: req.params.studentId });
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     // Extract course ID from student document
//     const courseIds = student.courses.map(course => course.course_id); 

//     // Find courses by IDs
//     const courseDetails = await Course.find({ course_id: { $in: courseIds } });

//     res.status(200).json({ student, courseDetails });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;