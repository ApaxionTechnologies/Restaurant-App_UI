const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

router.post('/register', async (req, res) => {
  try {
    const { restaurantName, firstName, lastName, contact, address, email, password } = req.body;
    // Basic validation
    if (!restaurantName || !firstName || !lastName || !contact || !address || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    // Save to DB
    const restaurant = new Restaurant({
      restaurantName,
      firstName,
      lastName,
      contact,
      address,
      email,
      password
    });
    await restaurant.save();
    res.status(201).json({ message: 'Restaurant registered successfully!' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists.' });
    }
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
