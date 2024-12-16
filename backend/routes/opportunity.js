const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');

// POST route to add opportunity data
router.post('/', async (req, res) => {
  try {
    const newOpportunity = new Opportunity(req.body);
    await newOpportunity.save();
    res.status(201).json(newOpportunity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET route to fetch all opportunities
router.get('/', async (req, res) => {
  try {
    const opportunities = await Opportunity.find();
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
