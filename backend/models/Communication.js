const mongoose = require('mongoose');

// Define the schema for communication data
const communicationSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email_Id: { type: String, required: true },
  "Domestic/International": { type: String, required: true },
  Country: { type: String, required: true },
  Date: { type: String, required: true },
  "Start_Time": { type: String, required: true },
  Caller: { type: String, required: true },
  From: { type: String, required: true },
  "Call Duration": { type: String, required: true },
  "Call Type": { type: String, required: true },
  Campaign: { type: String, required: true },
  "Call Status": { type: String, required: true }
});

// Create the model for communication data
const Communication = mongoose.model('Communication', communicationSchema);

module.exports = Communication;
