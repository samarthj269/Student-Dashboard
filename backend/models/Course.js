// const mongoose = require('mongoose');

// // Define the schema for course data
// const courseSchema = new mongoose.Schema({
//   Name: { type: String, required: true },
//   Email_Id: { type: String, required: true, unique: true },
//   Bootcamp: { type: String },
//   Courses: { type: String, required: true },
//   Brand: { type: String, required: true }
// });

// // Create the model for the course
// const Course = mongoose.model('Course', courseSchema);

// module.exports = Course;



const mongoose = require('mongoose');
const { courseConnection } = require('../server');

const courseSchema = new mongoose.Schema({
  course_id: { type: String, required: true },
  Name: { type: String, required: true },
  Email_Id: { type: String, required: true, unique: true },
  Bootcamp: { type: String },
  Courses: { type: String, required: true },
  Brand: { type: String, required: true }
});

const Course = courseConnection.model('Course', courseSchema);

module.exports = Course;
