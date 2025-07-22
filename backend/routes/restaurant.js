



const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// ✅ Register route
router.post('/register', async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    await newRestaurant.save();
    res.status(201).json({ message: 'Restaurant registered successfully!' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ✅ Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant || restaurant.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Login successful',
      restaurant: {
        id: restaurant._id,
        name: restaurant.restaurantName,
        email: restaurant.email
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
