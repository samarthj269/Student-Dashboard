const express = require('express');
const router = express.Router();
const Communication = require('../models/Communication');

// POST route to add communication data
router.post('/', async (req, res) => {
  try {
    const newCommunication = new Communication(req.body);
    await newCommunication.save();
    res.status(201).json(newCommunication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all communications
router.get('/', async (req, res) => {
  try {
    const communications = await Communication.find();
    res.json(communications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
