// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const Restaurant = require('../models/Restaurant');

// // ✅ Multer config (for optional image uploads)
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });
// const upload = multer({ storage });

// /* ✅ Register route */
// router.post('/register', async (req, res) => {
//   try {
//     console.log('Register payload:', JSON.stringify(req.body, null, 2));

//     const {
//       restaurantName, firstName, lastName,
//       contact, address, email, password
//     } = req.body;

//     if (typeof address !== 'object') {
//       return res.status(400).json({ error: 'Address must be an object.' });
//     }

//     const { line1, country, state, city } = address;

//     if (!restaurantName || !firstName || !lastName || !contact ||
//         !line1 || !country || !state || !city || !email || !password) {
//       return res.status(400).json({ error: 'All required fields must be filled.' });
//     }

//     const formattedEmail = email.trim().toLowerCase();

//     if (await Restaurant.findOne({ email: formattedEmail })) {
//       return res.status(400).json({ error: 'Email already exists.' });
//     }

//     const restaurant = new Restaurant({
//       restaurantName,
//       firstName,
//       lastName,
//       contact,
//       address: {
//         line1: line1.trim(),
//         line2: address.line2?.trim() || '',
//         country: country.trim(),
//         state: state.trim(),
//         city: city.trim()
//       },
//       email: formattedEmail,
//       password: password.trim()
//     });

//     await restaurant.save();

//     return res.status(201).json({
//       message: 'Restaurant registered successfully!',
//       restaurant: {
//         email: restaurant.email,
//         restaurantName: restaurant.restaurantName
//       }
//     });

//   } catch (err) {
//     console.error('Registration error:', err);
//     return res.status(500).json({ error: 'Server error.' });
//   }
// });

// /* ✅ Login route */
// // 🟨 Login Route
// // 🟨 Add this in routes/restaurant.js
// // Login route
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required.' });
//     }

//     const restaurant = await Restaurant.findOne({ email: email.trim().toLowerCase() });

//     if (!restaurant || restaurant.password !== password.trim()) {
//       return res.status(401).json({ error: 'Invalid email or password.' });
//     }

//     return res.status(200).json({
//       message: 'Login successful!',
//       restaurant: {
//         id: restaurant._id,
//         restaurantName: restaurant.restaurantName,
//         email: restaurant.email
//       }
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     return res.status(500).json({ error: 'Server error.' });
//   }
// });




// module.exports = router;



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
