const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: String,
  type: {
    type: String,
    enum: ['site-visit', 'callback', 'enquiry', 'offer'],
    default: 'enquiry'
  },
  preferredTime: String,
  status: {
    type: String,
    enum: ['new', 'contacted', 'visited', 'negotiating', 'closed', 'lost'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['listing-page', 'search', 'featured', 'ai-recommendation', 'direct'],
    default: 'listing-page'
  },
  notes: [{ text: String, createdAt: { type: Date, default: Date.now } }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', LeadSchema);
