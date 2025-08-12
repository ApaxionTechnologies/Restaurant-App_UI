




// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// // Storage config
// const storage = multer.memoryStorage(); // or diskStorage if you want to store it as file
// const upload = multer({ storage });

// // Route to handle menu item addition
// router.post("/add", upload.single("image"), async (req, res) => {
//   try {
//     const { name, price, timeToPrepare, restaurantEmail } = req.body;
//     const image = req.file; // optional: req.file.buffer if using memoryStorage

//     if (!name || !price || !timeToPrepare || !image || !restaurantEmail) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // You can now save this info to MongoDB
//     // Example:
//     const newItem = {
//       name,
//       price,
//       timeToPrepare,
//       restaurantEmail,
//       image: {
//         data: image.buffer,
//         contentType: image.mimetype,
//       },
//     };

//     // Save to DB (replace this with your model)
//     // await MenuModel.create(newItem);

//     res.status(201).json({ message: "Menu item added", data: newItem });
//   } catch (error) {
//     console.error("❌ Error adding menu item:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;


// // routes/menu.js
// import express from 'express';
// import MenuItem from '../models/MenuItem.js';

// const router = express.Router();

// // POST - Add a menu item
// router.post('/add', async (req, res) => {
//   try {
//     const { restaurantEmail, name, price, category, timeToPrepare } = req.body;

//     const newItem = new MenuItem({
//       restaurantEmail,
//       name,
//       price,
//       category,
//       timeToPrepare
//     });

//     await newItem.save();
//     res.status(201).json({ message: 'Menu item added successfully' });
//   } catch (error) {
//     console.error('Error adding menu item:', error.message);
//     res.status(500).json({ error: 'Failed to add menu item' });
//   }
// });

// // GET - Get all menu items
// router.get('/all', async (req, res) => {
//   try {
//     const items = await MenuItem.find();
//     res.status(200).json(items);
//   } catch (error) {
//     console.error('Error fetching menu:', error.message);
//     res.status(500).json({ error: 'Failed to fetch menu' });
//   }
// });

// // PUT - Update a menu item
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedItem);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE - Delete a menu item
// router.delete('/:id', async (req, res) => {
//   try {
//     await MenuItem.findByIdAndDelete(req.params.id);
//     res.json({ message: "Item deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


// ✅ routes/menu.js
import express from 'express';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

// POST - Add a menu item
router.post('/add', async (req, res) => {
  try {
    const { restaurantEmail, name, price, category, timeToPrepare } = req.body;

    const newItem = new MenuItem({
      restaurantEmail,
      name,
      price,
      category,
      timeToPrepare,
    });

    await newItem.save();
    res.status(201).json({ message: 'Menu item added successfully', item: newItem });
  } catch (error) {
    console.error('Error adding menu item:', error.message);
    res.status(500).json({ error: 'Failed to add menu item' });
  }
});

// GET - Get all menu items
router.get('/all', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching menu:', error.message);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// PUT - Update a menu item by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) return res.status(404).json({ error: 'Menu item not found' });
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error('Error updating menu item:', err.message);
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// DELETE - Delete a menu item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: 'Menu item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting menu item:', err.message);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});


export default router;
