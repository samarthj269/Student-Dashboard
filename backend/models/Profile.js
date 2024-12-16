const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true, // This field is required
    },
    Email_Id: {
        type: String,
        required: true, // This field is required
        unique: true, // Optional: if you want to ensure unique email IDs
    },
    Domestic_International: {
        type: String,
        required: true, // This field is required
    },
    Country: {
        type: String,
        required: true, // This field is required
    },
    Date: {
        type: String,
        required: true, // This field is required
    },
    Start_Time: {
        type: String,
        required: true, // This field is required
    },
    Caller: {
        type: String,
        required: true, // This field is required
    },
    From: {
        type: String,
        required: true, // This field is required
    },
    Call_Duration: {
        type: String,
        required: true, // This field is required
    },
    Call_Type: {
        type: String,
        required: true, // This field is required
    },
    Call_Status: {
        type: String,
        required: true, // This field is required
    },
    // Add any additional fields as necessary
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
