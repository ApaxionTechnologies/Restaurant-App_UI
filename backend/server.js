const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images from 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/qrmenu', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
const restaurantRoutes = require('./routes/restaurant');
app.use('/api', restaurantRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
