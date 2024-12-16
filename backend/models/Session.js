const mongoose = require('mongoose');

// Define the schema for session data
const sessionSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email_Id: { type: String, required: true },
  Mentor: { type: String, required: true },
  "Type of Session": { type: String, required: true },
  Topic: { type: String, required: true },
  "Date of Session": { type: String, required: true },
  "Start Time": { type: String, required: true },
  "End Time": { type: String, required: true },
  "Meeting Duration": { type: String, required: true },
  "Session Sub Type": { type: String, required: true },
  Status: { type: String, required: true },
  "Session ID": { type: String, required: true },
  "Scheduler Email ID": { type: String, required: true },
  "Mentor Email ID": { type: String, required: true }
});

// Create the model for session data
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
