const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// ==========================
// 📝 Restaurant Registration
// ==========================
router.post('/register', async (req, res) => {
  try {
    const {
      restaurantName,
      firstName,
      lastName,
      contact,
      address,
      email,
      password
    } = req.body;

    // Basic validation
    if (
      !restaurantName || !firstName || !lastName || !contact ||
      !address || !email || !password
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const formattedEmail = email.trim().toLowerCase();
    const formattedPassword = password.trim();

    // Check if email already exists
    const existingRestaurant = await Restaurant.findOne({ email: formattedEmail });
    if (existingRestaurant) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    // Save to DB
    const restaurant = new Restaurant({
      restaurantName,
      firstName,
      lastName,
      contact,
      address,
      email: formattedEmail,       // ✅ Save lowercase email
      password: formattedPassword, // ✅ Trimmed password
    });

    await restaurant.save();
    res.status(201).json({ message: 'Restaurant registered successfully!' });

  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// =====================
// 🔐 Restaurant Login
// =====================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const formattedEmail = email.trim().toLowerCase();
    const formattedPassword = password.trim();

    console.log('📩 Incoming Login Request:');
    console.log('Email:', formattedEmail);
    console.log('Password:', formattedPassword);

    // Find restaurant by lowercased + trimmed email
    const restaurant = await Restaurant.findOne({ email: formattedEmail });

    if (!restaurant) {
      console.log('❌ Email not found:', formattedEmail);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare plain text passwords
    if (restaurant.password !== formattedPassword) {
      console.log('❌ Incorrect password for:', formattedEmail);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    console.log('✅ Login successful for:', formattedEmail);
    res.status(200).json({ message: 'Login successful', restaurant });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
