// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const Restaurant = require('../models/Restaurant');
// const path = require('path');

// // ✅ Multer setup for image upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + '-' + file.originalname;
//     cb(null, uniqueName);
//   }
// });
// const upload = multer({ storage: storage });

// // ✅ Restaurant Registration
// router.post('/register', async (req, res) => {
//   try {
//     const {
//       restaurantName,
//       firstName,
//       lastName,
//       contact,
//       address,
//       email,
//       password
//     } = req.body;

//     if (!restaurantName || !firstName || !lastName || !contact || !address || !email || !password) {
//       return res.status(400).json({ error: 'All fields are required.' });
//     }

//     const formattedEmail = email.trim().toLowerCase();
//     const existingRestaurant = await Restaurant.findOne({ email: formattedEmail });
//     if (existingRestaurant) {
//       return res.status(400).json({ error: 'Email already exists.' });
//     }

//     const restaurant = new Restaurant({
//       restaurantName,
//       firstName,
//       lastName,
//       contact,
//       address,
//       email: formattedEmail,
//       password: password.trim()
//     });

//     await restaurant.save();
//     res.status(201).json({ message: 'Restaurant registered successfully!' });

//   } catch (err) {
//     console.error('Registration error:', err);
//     res.status(500).json({ error: 'Server error.' });
//   }
// });

// // ✅ Restaurant Login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email and password are required.' });
//     }

//     const formattedEmail = email.trim().toLowerCase();
//     const formattedPassword = password.trim();

//     const restaurant = await Restaurant.findOne({ email: formattedEmail });
//     if (!restaurant || restaurant.password !== formattedPassword) {
//       return res.status(401).json({ error: 'Invalid email or password.' });
//     }

//     res.status(200).json({ message: 'Login successful', restaurant });

//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ error: 'Server error.' });
//   }
// });

// // ✅ Add menu item (image upload or link)
// router.post('/add-menu-item', upload.single('image'), async (req, res) => {
//   const { email, name, price, imageUrl } = req.body;

//   try {
//     const restaurant = await Restaurant.findOne({ email });
//     if (!restaurant) {
//       return res.status(404).json({ error: 'Restaurant not found' });
//     }

//     const finalImageUrl = imageUrl || (req.file ? `/uploads/${req.file.filename}` : '');

//     const newItem = { name, price, imageUrl: finalImageUrl };
//     restaurant.menu.push(newItem);
//     await restaurant.save();

//     res.status(201).json({ message: 'Item added successfully', item: newItem });

//   } catch (error) {
//     console.error('Error adding menu item:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Get all menu items
// router.get('/menu/:email', async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findOne({ email: req.params.email });
//     if (!restaurant) {
//       return res.status(404).json({ error: 'Restaurant not found' });
//     }

//     res.json(restaurant.menu);
//   } catch (error) {
//     console.error('Error fetching menu:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Increase tables
// router.put('/tables/increase/:email', async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findOne({ email: req.params.email });
//     if (!restaurant) {
//       return res.status(404).json({ error: 'Restaurant not found' });
//     }

//     restaurant.tables += 1;
//     await restaurant.save();

//     res.json({ message: 'Table increased', tables: restaurant.tables });

//   } catch (error) {
//     console.error('Increase table error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // ✅ Decrease tables
// router.put('/tables/decrease/:email', async (req, res) => {
//   try {
//     const restaurant = await Restaurant.findOne({ email: req.params.email });
//     if (!restaurant) {
//       return res.status(404).json({ error: 'Restaurant not found' });
//     }

//     if (restaurant.tables > 0) {
//       restaurant.tables -= 1;
//       await restaurant.save();
//     }

//     res.json({ message: 'Table decreased', tables: restaurant.tables });

//   } catch (error) {
//     console.error('Decrease table error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');

const Restaurant = require('../models/Restaurant');
const path = require('path');

// ✅ Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

/**
 * ✅ Restaurant Registration
 */
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

    if (!restaurantName || !firstName || !lastName || !contact || !address || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const formattedEmail = email.trim().toLowerCase();
    const existingRestaurant = await Restaurant.findOne({ email: formattedEmail });
    if (existingRestaurant) {
      return res.status(400).json({ error: 'Email already exists.' });
    }


    const restaurant = new Restaurant({
      restaurantName,
      firstName,
      lastName,
      contact,
      address,
      email: formattedEmail,
      password: password.trim()
    });

    await restaurant.save();
    res.status(201).json({
      message: 'Restaurant registered successfully!',
      restaurant: {
        email: restaurant.email,
        restaurantName: restaurant.restaurantName
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * ✅ Fetch restaurant name by email
 */
router.get('/restaurant/:email', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ email: req.params.email });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json({ name: restaurant.restaurantName });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * ✅ Restaurant Login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const formattedEmail = email.trim().toLowerCase();
    const restaurant = await Restaurant.findOne({ email: formattedEmail });
    if (!restaurant) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }


    if (restaurant.password !== password.trim()) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.status(200).json({ message: 'Login successful', restaurant });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * ✅ Add menu item (with optional image upload)
 */
router.post('/add-menu-item', upload.single('image'), async (req, res) => {
  const { email, name, price, imageUrl, category } = req.body;

  try {
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const finalImageUrl = imageUrl || (req.file ? `/uploads/${req.file.filename}` : '');

    const newItem = { name, price, imageUrl: finalImageUrl, category };
    restaurant.menu.push(newItem);
    await restaurant.save();

    res.status(201).json({ message: 'Item added successfully', item: newItem });

  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * ✅ Get all menu items by restaurant name
 */
router.get('/menu/:restaurantName', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ restaurantName: req.params.restaurantName });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Group menu by category
    const menuByCategory = {
      Starters: restaurant.menu.filter(item => item.category === 'Starters'),
      Mains: restaurant.menu.filter(item => item.category === 'Mains'),
      Desserts: restaurant.menu.filter(item => item.category === 'Desserts'),
      Beverages: restaurant.menu.filter(item => item.category === 'Beverages')
    };

    res.json(menuByCategory);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * ✅ Increase tables
 */
router.put('/tables/increase/:email', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ email: req.params.email });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    restaurant.tables += 1;
    await restaurant.save();

    res.json({ message: 'Table increased', tables: restaurant.tables });

  } catch (error) {
    console.error('Increase table error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * ✅ Decrease tables
 */
router.put('/tables/decrease/:email', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ email: req.params.email });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    if (restaurant.tables > 0) {
      restaurant.tables -= 1;
      await restaurant.save();
    }

    res.json({ message: 'Table decreased', tables: restaurant.tables });

  } catch (error) {
    console.error('Decrease table error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

