const Property = require('../models/Property');
const User = require('../models/User');

// @desc    Get all properties with filters + pagination
// @route   GET /api/properties
exports.getProperties = async (req, res) => {
  try {
    const {
      listingType, type, city, locality, minPrice, maxPrice,
      bedrooms, furnishing, parking, amenities, search,
      sort = '-createdAt', page = 1, limit = 12, featured
    } = req.query;

    const query = { status: 'active' };

    if (listingType) query.listingType = listingType;
    if (type) query.type = type;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (locality) query['location.locality'] = new RegExp(locality, 'i');
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (furnishing) query.furnishing = furnishing;
    if (parking) query.parking = parking;
    if (featured === 'true') query.featured = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);

    const properties = await Property.find(query)
      .populate('agent', 'name phone email avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      count: properties.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: properties
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Server error fetching properties' });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('agent', 'name phone email avatar role');

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment views
    await Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    // Similar properties
    const similar = await Property.find({
      _id: { $ne: property._id },
      listingType: property.listingType,
      'location.city': property.location.city,
      type: property.type,
      status: 'active'
    }).limit(4).select('title price location images bedrooms bathrooms area type');

    res.json({ success: true, data: property, similar });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create property
// @route   POST /api/properties
exports.createProperty = async (req, res) => {
  try {
    req.body.agent = req.user.id;
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this property' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });

    res.json({ success: true, data: property });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    if (property.agent.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Toggle wishlist
// @route   PUT /api/properties/:id/wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const propertyId = req.params.id;
    const index = user.wishlist.indexOf(propertyId);

    if (index === -1) {
      user.wishlist.push(propertyId);
    } else {
      user.wishlist.splice(index, 1);
    }
    await user.save();

    res.json({
      success: true,
      wishlisted: index === -1,
      message: index === -1 ? 'Added to wishlist' : 'Removed from wishlist'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get city statistics
// @route   GET /api/properties/stats
exports.getStats = async (req, res) => {
  try {
    const stats = await Property.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const totals = await Property.aggregate([
      {
        $group: {
          _id: '$listingType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ success: true, citiesStats: stats, totals });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
