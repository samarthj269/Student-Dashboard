const mongoose = require('mongoose');

// Define the schema for opportunity data
const opportunitySchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email_Id: { type: String, required: true },
  opportunity_name: { type: String, required: true },
  Position: { type: String, default: "Not Available" },
  "Offer status": { type: String, required: true },
  Type: { type: String, required: true },
  Company: { type: String, required: true },
  "Organisation Category": { type: String, required: true },
  "Type of Company": { type: String, default: "Not Available" },
  "Month of Sucess": { type: String, required: true },
  "Month Of Joining": { type: String, required: true },
  "Legal/Non Legal": { type: String, default: "Not Available" }
});

// Create the model for the opportunity data
const Opportunity = mongoose.model('Opportunity', opportunitySchema);

module.exports = Opportunity;
