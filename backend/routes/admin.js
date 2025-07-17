const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define MenuItem schema
const menuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  rating: Number,
});

const tableSchema = new mongoose.Schema({
  count: Number,
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const Table = mongoose.model('Table', tableSchema);

// Add a new menu item
router.post('/add-item', async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json({ message: 'Item added successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item.' });
  }
});

// Delete a menu item by ID
router.delete('/delete-item/:id', async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

// Get all menu items
router.get('/menu-items', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items.' });
  }
});

// Set/update number of tables
router.post('/update-tables', async (req, res) => {
  try {
    const { count } = req.body;
    let table = await Table.findOne();
    if (!table) {
      table = new Table({ count });
    } else {
      table.count = count;
    }
    await table.save();
    res.json({ message: 'Table count updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update table count.' });
  }
});

// Get table count
router.get('/table-count', async (req, res) => {
  try {
    const table = await Table.findOne();
    res.json({ count: table?.count || 0 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch table count.' });
  }
});

module.exports = router;
