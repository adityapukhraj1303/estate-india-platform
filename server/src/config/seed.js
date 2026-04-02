const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../../.env' });

const User = require('../models/User');
const Property = require('../models/Property');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/estate-india';

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];
const localities = {
  Mumbai: ['Bandra', 'Andheri', 'Powai', 'Worli', 'Juhu', 'Malad', 'Thane'],
  Delhi: ['Dwarka', 'Rohini', 'Saket', 'Vasant Kunj', 'Pitampura', 'Lajpat Nagar'],
  Bangalore: ['Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout', 'Electronic City', 'Marathahalli'],
  Pune: ['Hinjewadi', 'Kothrud', 'Wakad', 'Baner', 'Viman Nagar', 'Hadapsar'],
  Chennai: ['Anna Nagar', 'Velachery', 'OMR', 'Adyar', 'Besant Nagar', 'Porur'],
  Hyderabad: ['Gachibowli', 'HITEC City', 'Kondapur', 'Madhapur', 'Banjara Hills', 'Jubilee Hills'],
  Kolkata: ['Salt Lake', 'New Town', 'Rajarhat', 'Park Street', 'Alipore'],
  Ahmedabad: ['Satellite', 'Prahlad Nagar', 'SG Highway', 'Bodakdev', 'Vastrapur']
};

const types = ['apartment', 'villa', 'house', 'plot', 'commercial', 'studio'];
const listingTypes = ['buy', 'rent'];
const furnishingOptions = ['unfurnished', 'semi-furnished', 'fully-furnished'];
const amenitiesPool = ['swimming-pool', 'gym', 'security', 'lift', 'power-backup', 'parking', 'club-house', 'garden', 'intercom', 'cctv', 'gated-community'];

const propertyImages = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randItems = (arr, n) => arr.sort(() => 0.5 - Math.random()).slice(0, n);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@estateindia.com', password: hashedPass, role: 'admin', phone: '9999900000', isVerified: true },
      { name: 'Raj Sharma', email: 'raj@agent.com', password: hashedPass, role: 'agent', phone: '9876543210', isVerified: true },
      { name: 'Priya Mehta', email: 'priya@agent.com', password: hashedPass, role: 'agent', phone: '9876543211', isVerified: true },
      { name: 'Amit Patel', email: 'amit@agent.com', password: hashedPass, role: 'agent', phone: '9876543212', isVerified: true },
      { name: 'Test User', email: 'user@test.com', password: hashedPass, role: 'user', phone: '9000000000', isVerified: true }
    ]);
    console.log(`👤 Created ${users.length} users`);

    const agents = users.filter(u => u.role === 'agent');

    // Create 60 properties
    const properties = [];
    const titles = ['Spacious', 'Modern', 'Luxurious', 'Affordable', 'Premium', 'Contemporary', 'Elegant', 'Ultra-Luxury'];
    const suffixes = ['Apartment', 'Villa', 'Residence', 'Home', 'Suite', 'Tower', 'Heights', 'Park'];

    for (let i = 0; i < 60; i++) {
      const city = rand(cities);
      const locality = rand(localities[city]);
      const type = rand(types);
      const listingType = rand(listingTypes);
      const bedrooms = type === 'studio' ? 0 : randNum(1, 5);
      const area = randNum(400, 4000);

      const basePrices = { Mumbai: 25000, Delhi: 18000, Bangalore: 15000, Pune: 12000, Chennai: 11000, Hyderabad: 10000, Kolkata: 8000, Ahmedabad: 7000 };
      const baseRate = basePrices[city] || 8000;
      const price = listingType === 'rent'
        ? randNum(baseRate / 100, baseRate / 30) * area / 100 * 100
        : Math.round(baseRate * area * (0.8 + Math.random() * 0.6));

      const imgIdx = randNum(0, propertyImages.length - 1);

      properties.push({
        title: `${rand(titles)} ${bedrooms > 0 ? bedrooms + 'BHK ' : ''}${rand(suffixes)} in ${locality}`,
        description: `A beautiful ${type} located in the heart of ${locality}, ${city}. This property offers excellent connectivity, modern amenities, and a comfortable living environment. Perfect for families looking for a premium lifestyle.`,
        type,
        listingType,
        price: Math.round(price / 1000) * 1000,
        area: { total: area, carpet: Math.round(area * 0.85) },
        bedrooms,
        bathrooms: Math.max(1, bedrooms),
        balconies: randNum(0, 2),
        furnishing: rand(furnishingOptions),
        parking: rand(['none', 'bike', 'car', 'both']),
        location: {
          address: `${randNum(1, 200)}, ${locality} Main Road`,
          locality,
          city,
          state: 'India',
          pincode: String(randNum(400001, 600099))
        },
        amenities: randItems([...amenitiesPool], randNum(3, 8)),
        images: [
          { url: propertyImages[imgIdx], alt: `${type} in ${locality}`, isPrimary: true },
          { url: propertyImages[(imgIdx + 1) % propertyImages.length], alt: 'Interior view' },
          { url: propertyImages[(imgIdx + 2) % propertyImages.length], alt: 'Living area' }
        ],
        agent: rand(agents)._id,
        featured: Math.random() > 0.75,
        status: 'active',
        views: randNum(10, 500),
        leads: randNum(0, 30)
      });
    }

    await Property.insertMany(properties);
    console.log(`🏠 Created ${properties.length} properties`);
    console.log('\n✅ Database seeded successfully!\n');
    console.log('📧 Login credentials:');
    console.log('   Admin:  admin@estateindia.com / password123');
    console.log('   Agent:  raj@agent.com / password123');
    console.log('   User:   user@test.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
