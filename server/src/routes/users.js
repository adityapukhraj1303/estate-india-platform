const express = require('express');
const User = require('../models/User');
const Property = require('../models/Property');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get user wishlist
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'title price location images type listingType bedrooms bathrooms area status');
    res.json({ success: true, data: user.wishlist });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get agent's listings
router.get('/my-listings', protect, authorize('agent', 'admin'), async (req, res) => {
  try {
    const properties = await Property.find({ agent: req.user.id }).sort('-createdAt');
    res.json({ success: true, data: properties, count: properties.length });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Get all users
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
