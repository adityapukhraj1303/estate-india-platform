const express = require('express');
const Lead = require('../models/Lead');
const Property = require('../models/Property');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Submit a lead
router.post('/', async (req, res) => {
  try {
    const { propertyId, name, email, phone, message, type, preferredTime } = req.body;
    const property = await Property.findById(propertyId).select('agent');
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const lead = await Lead.create({
      property: propertyId,
      agent: property.agent,
      user: req.user?.id,
      name, email, phone, message, type, preferredTime,
      source: req.body.source || 'listing-page'
    });

    await Property.findByIdAndUpdate(propertyId, { $inc: { leads: 1 } });
    res.status(201).json({ success: true, lead, message: 'Your enquiry has been submitted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Server error submitting lead' });
  }
});

// Get agent leads
router.get('/my-leads', protect, authorize('agent', 'admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { agent: req.user.id };
    if (status) query.status = status;

    const leads = await Lead.find(query)
      .populate('property', 'title location price images')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Lead.countDocuments(query);
    res.json({ success: true, data: leads, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update lead status
router.put('/:id/status', protect, authorize('agent', 'admin'), async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
