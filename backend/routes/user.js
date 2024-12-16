

const express = require('express');
const User = require('../models/User'); // Adjust the path if necessary
const bcrypt = require('bcrypt');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, contact, password, securityQuestion, securityAnswer } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            contact,
            password, // Make sure to hash the password before saving
            securityQuestion,
            securityAnswer,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Signup route error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/forgot-password', async (req, res) => {
    const { email, securityAnswer, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the provided security answer is valid
        const isAnswerValid = await user.isValidSecurityAnswer(securityAnswer);
        if (!isAnswerValid) {
            return res.status(400).json({ message: 'Invalid security answer.' });
        }

        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.status(200).json({ message: 'Password reset successful!' });
    } catch (err) {
        console.error('Error during password reset:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;

