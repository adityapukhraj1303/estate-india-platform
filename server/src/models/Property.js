const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: 150
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  type: {
    type: String,
    enum: ['apartment', 'villa', 'house', 'plot', 'commercial', 'pg', 'studio'],
    required: true
  },
  listingType: {
    type: String,
    enum: ['buy', 'rent', 'pg'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  priceUnit: {
    type: String,
    enum: ['total', 'per_month', 'per_sqft'],
    default: 'total'
  },
  area: {
    total: { type: Number, required: true },
    carpet: Number,
    unit: { type: String, default: 'sqft' }
  },
  bedrooms: { type: Number, default: 0 },
  bathrooms: { type: Number, default: 0 },
  balconies: { type: Number, default: 0 },
  floors: { type: Number, default: 1 },
  totalFloors: Number,
  furnishing: {
    type: String,
    enum: ['unfurnished', 'semi-furnished', 'fully-furnished'],
    default: 'unfurnished'
  },
  parking: {
    type: String,
    enum: ['none', 'bike', 'car', 'both'],
    default: 'none'
  },
  facing: {
    type: String,
    enum: ['north', 'south', 'east', 'west', 'north-east', 'north-west', 'south-east', 'south-west'],
  },
  age: {
    type: String,
    enum: ['under-construction', '0-1', '1-5', '5-10', '10+'],
    default: '0-1'
  },
  location: {
    address: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  amenities: [{
    type: String,
    enum: ['swimming-pool', 'gym', 'security', 'lift', 'power-backup', 'parking', 'club-house', 'playground', 'garden', 'intercom', 'cctv', 'gated-community', 'visitor-parking', 'rainwater-harvesting', 'fire-safety']
  }],
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  virtualTour: String,
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'inactive'],
    default: 'active'
  },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  leads: { type: Number, default: 0 },
  aiPredictedPrice: Number,
  aiConfidenceScore: Number,
  priceHistory: [{
    price: Number,
    date: { type: Date, default: Date.now }
  }],
  nearbyPlaces: [{
    type: String,
    name: String,
    distance: String
  }],
  availableFrom: Date,
  possessionDate: Date,
  rera: String
}, {
  timestamps: true
});

// Indexes for search performance
PropertySchema.index({ 'location.city': 1, listingType: 1, type: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ bedrooms: 1 });
PropertySchema.index({ status: 1, featured: -1 });
PropertySchema.index({ title: 'text', description: 'text', 'location.locality': 'text', 'location.city': 'text' });

module.exports = mongoose.model('Property', PropertySchema);
