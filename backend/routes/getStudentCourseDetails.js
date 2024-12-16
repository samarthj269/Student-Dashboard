const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Helper function to read JSON files
const readJsonFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
});

// Route to get course and batch details by Student_Id
router.get('/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Read student details
    const studentFilePath = path.join(__dirname, '../data', 'studentDetails.json');
    const studentData = await readJsonFile(studentFilePath);
    const studentDetails = studentData.find(student => student.Student_Id === studentId);

    if (!studentDetails) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { course_id, Batch } = studentDetails;

    // Read course details
    const courseFilePath = path.join(__dirname, '../data', 'courseDetails.json');
    const courseData = await readJsonFile(courseFilePath);
    const courseDetails = courseData.find(course => course.course_id === course_id);

    // Read batch details
    const batchFilePath = path.join(__dirname, '../data', 'batchDetails.json');
    const batchData = await readJsonFile(batchFilePath);
    const batchDetails = batchData.find(batch => batch.batch_id === Batch);

    // Combine the results
    const result = {
      studentDetails,
      courseDetails: courseDetails || null,
      batchDetails: batchDetails || null,
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
