const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile'); // Adjust the model path as necessary

// POST route to add profile data
router.post('/', async (req, res) => {
    try {
        const newProfile = new Profile(req.body); // Create a new profile instance with the request body
        await newProfile.save(); // Save the new profile to the database
        res.status(201).json(newProfile); // Send back the created profile with a 201 status
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle errors and send a 400 status
    }
});

// GET route to fetch all profiles (optional)
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find(); // Retrieve all profiles
        res.json(profiles); // Send profiles as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle errors and send a 500 status
    }
});

module.exports = router; // Export the router
