const mongoose = require('mongoose');

// High-quality Unsplash real estate images
const PROPERTY_IMAGES = {
  villa: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  ],
  apartment: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  ],
  commercial: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
  ],
  penthouse: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  ],
  house: [
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
  ],
};

const PROPERTIES = [];
const cities = [
  { c: 'Goa', locs: ['Anjuna', 'Calangute', 'Vagator', 'Candolim', 'Morjim'] },
  { c: 'Mumbai', locs: ['Worli', 'Marine Lines', 'Bandra West', 'Juhu', 'Lower Parel', 'Powai'] },
  { c: 'Bangalore', locs: ['Manyata Tech Park', 'Whitefield', 'Koramangala', 'Indiranagar', 'Electronic City'] },
  { c: 'Delhi', locs: ['Greater Kailash', "Lutyens' Delhi"] },
  { c: 'Gurgaon', locs: ['Cyber Hub', 'Golf Course Road'] },
  { c: 'Noida', locs: ['Sector 150', 'Sector 44'] },
  { c: 'Hyderabad', locs: ['Banjara Hills', 'HITEC City', 'Jubilee Hills'] },
  { c: 'Pune', locs: ['Koregaon Park', 'Hinjewadi', 'Baner'] },
  { c: 'Chennai', locs: ['ECR', 'Anna Nagar', 'Adyar'] },
  { c: 'Ahmedabad', locs: ['SG Highway', 'Prahlad Nagar', 'Bodakdev'] }
];

const types = ['villa', 'apartment', 'commercial', 'apartment', 'house'];
const adjectives = ['Luxury', 'Ultra-Modern', 'Sea-View', 'Premium', 'Smart', 'Heritage', 'Beachfront', 'Lakeside', 'Exclusive', 'Panoramic'];
const propertyNames = {
  villa: ['Villa', 'Bungalow', 'Estate'],
  apartment: ['Flat', 'Apartment', 'Studio'],
  commercial: ['Office Space', 'Tech Park', 'Business Center'],
  penthouse: ['Penthouse', 'Sky Villa', 'Duplex Penthouse'],
  house: ['House', 'Row House', 'Townhouse']
};

for (let i = 1; i <= 100; i++) {
  const cityObj = cities[Math.floor(Math.random() * cities.length)];
  const city = cityObj.c;
  const locality = cityObj.locs[Math.floor(Math.random() * cityObj.locs.length)];
  const type = types[Math.floor(Math.random() * types.length)];
  const pNamesForType = propertyNames[type];
  const typeName = pNamesForType[Math.floor(Math.random() * pNamesForType.length)];
  const listingType = Math.random() > 0.4 ? 'buy' : 'rent';
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  
  PROPERTIES.push({
    title: `${adj} ${typeName} in ${locality}`,
    city: city,
    locality: locality,
    type: type,
    listingType: listingType,
    price: listingType === 'buy' ? Math.floor(Math.random() * 200) * 500000 + 10000000 : Math.floor(Math.random() * 100) * 5000 + 40000,
    area: Math.floor(Math.random() * 50) * 100 + 800,
    bedrooms: type === 'commercial' ? 0 : Math.floor(Math.random() * 4) + 2,
    bathrooms: type === 'commercial' ? Math.floor(Math.random() * 5) + 2 : Math.floor(Math.random() * 4) + 2,
    isFeatured: Math.random() > 0.8
  });
}

const getImages = (type) => {
  const key = type === 'penthouse' ? 'penthouse' : type === 'commercial' ? 'commercial' : type === 'house' ? 'house' : type === 'villa' ? 'villa' : 'apartment';
  const imgs = PROPERTY_IMAGES[key] || PROPERTY_IMAGES.apartment;
  return imgs;
};

const seedDB = async () => {
  try {
    const mongoUri = 'mongodb://localhost:27017/estate-india';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Load actual model to ensure indexes and schema validation (or define the needed ones for raw insertion)
    const Property = require('./src/models/Property');
    
    await Property.deleteMany({});
    console.log('Cleared existing properties.');

    // We need a dummy user for the agent reference
    const User = require('./src/models/User');
    let agent = await User.findOne({ email: 'admin@estateindia.com' });
    if (!agent) {
      agent = await User.create({
        name: 'Admin Agent',
        email: 'admin@estateindia.com',
        password: 'password123',
        role: 'admin'
      });
    }

    const docs = PROPERTIES.map((p, i) => ({
      title: p.title,
      description: `Experience ultra-premium living in ${p.locality}, ${p.city}. This ${p.type} offers world-class amenities, state-of-the-art security, and breathtaking views perfect for the discerning buyer.`,
      price: p.price,
      area: { total: p.area, unit: 'sqft' },
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      type: p.type,
      listingType: p.listingType,
      location: {
        address: `Plot ${i + 1}, ${p.locality}`,
        city: p.city,
        locality: p.locality,
        state: 'N/A', // Mongoose requires this
        zipcode: `${400000 + i}`
      },
      images: getImages(p.type).map(img => ({ url: img, alt: 'Property', isPrimary: true })),
      amenities: ['swimming-pool', 'gym', 'parking', 'security'],
      isFeatured: p.isFeatured,
      status: 'active', // Important for the controller
      agent: agent._id,
      createdAt: new Date()
    }));

    await Property.insertMany(docs);
    console.log(`\n✅ Successfully seeded ${docs.length} premium properties!\n`);
    console.log('Cities covered:', [...new Set(docs.map(d => d.location.city))].join(', '));

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
