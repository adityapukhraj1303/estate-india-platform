const express = require('express');
const {
  getProperties, getProperty, createProperty,
  updateProperty, deleteProperty, toggleWishlist, getStats
} = require('../controllers/propertyController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', getStats);
router.get('/', optionalAuth, getProperties);
router.get('/:id', optionalAuth, getProperty);
router.post('/', protect, authorize('agent', 'admin'), createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.put('/:id/wishlist', protect, toggleWishlist);

module.exports = router;
