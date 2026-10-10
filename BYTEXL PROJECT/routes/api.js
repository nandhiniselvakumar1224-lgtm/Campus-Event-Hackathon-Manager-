const express = require('express');
const router = express.Router();

const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');

// Get all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create event
router.post('/events', async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get event by ID
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Register for event
router.post('/register', async (req, res) => {
  try {
    const {
      eventId,
      name,
      email,
      department,
      teamName,
      teamMembers
    } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: 'Event not found.'
      });
    }

    let user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      user = await User.create({
        name,
        email: email.trim().toLowerCase(),
        department,
        password:'Temp@12345'
      });
    }

    // Check whether this student already registered
    const existingRegistration = await Registration.findOne({
      eventId,
      studentId: user._id
    });

    if (existingRegistration) {
      return res.status(409).json({
        message: 'You have already registered for this event!'
      });
    }

    const registration = await Registration.create({
      eventId,
      studentId: user._id,
      teamName,
      teamMembers: teamMembers || []
    });

    return res.status(201).json({
      message: 'Registration successful!',
      registration
    });
  } catch (error) {
    console.error('Registration error:', error);

    return res.status(400).json({
      message: error.code === 11000
        ? 'You have already registered for this event!'
        : error.message
    });
  }
});

// View participants
router.get('/participants/:eventId', async (req, res) => {
  try {
    const participants = await Registration.find({
      eventId: req.params.eventId
    }).populate('studentId', 'name email department');

    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;