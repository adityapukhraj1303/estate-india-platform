const express = require('express');
const { smartSearch, predictPrice, getRecommendations, calculateEMI, chat } = require('../controllers/aiController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/smart-search', smartSearch);
router.post('/predict-price', optionalAuth, predictPrice);
router.post('/recommendations', protect, getRecommendations);
router.post('/emi-calculate', calculateEMI);
router.post('/chat', chat);

module.exports = router;
