const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Flight = require('../models/Flight');

const sampleFlights = [
  {
    flightNumber: 'SK101',
    airline: 'SkyReserve Airlines',
    source: 'NEW DELHI',
    destination: 'MUMBAI',
    departureTime: new Date('2026-05-15T06:00:00Z'),
    arrivalTime: new Date('2026-05-15T08:15:00Z'),
    price: 4500,
    seatsAvailable: 120,
  },
  {
    flightNumber: 'SK202',
    airline: 'SkyReserve Airlines',
    source: 'MUMBAI',
    destination: 'BANGALORE',
    departureTime: new Date('2026-05-15T09:30:00Z'),
    arrivalTime: new Date('2026-05-15T11:15:00Z'),
    price: 3800,
    seatsAvailable: 85,
  },
  {
    flightNumber: 'AI303',
    airline: 'Air India',
    source: 'NEW DELHI',
    destination: 'CHENNAI',
    departureTime: new Date('2026-05-15T11:00:00Z'),
    arrivalTime: new Date('2026-05-15T13:45:00Z'),
    price: 5200,
    seatsAvailable: 60,
  },
  {
    flightNumber: 'IG404',
    airline: 'IndiGo',
    source: 'BANGALORE',
    destination: 'NEW DELHI',
    departureTime: new Date('2026-05-15T14:00:00Z'),
    arrivalTime: new Date('2026-05-15T16:45:00Z'),
    price: 4100,
    seatsAvailable: 150,
  },
  {
    flightNumber: 'SJ505',
    airline: 'SpiceJet',
    source: 'HYDERABAD',
    destination: 'MUMBAI',
    departureTime: new Date('2026-05-15T07:30:00Z'),
    arrivalTime: new Date('2026-05-15T09:15:00Z'),
    price: 3200,
    seatsAvailable: 95,
  },
  {
    flightNumber: 'SK606',
    airline: 'SkyReserve Airlines',
    source: 'CHENNAI',
    destination: 'KOLKATA',
    departureTime: new Date('2026-05-16T08:00:00Z'),
    arrivalTime: new Date('2026-05-16T10:30:00Z'),
    price: 4800,
    seatsAvailable: 70,
  },
  {
    flightNumber: 'AI707',
    airline: 'Air India',
    source: 'MUMBAI',
    destination: 'NEW DELHI',
    departureTime: new Date('2026-05-16T16:00:00Z'),
    arrivalTime: new Date('2026-05-16T18:15:00Z'),
    price: 5500,
    seatsAvailable: 45,
  },
  {
    flightNumber: 'IG808',
    airline: 'IndiGo',
    source: 'NEW DELHI',
    destination: 'HYDERABAD',
    departureTime: new Date('2026-05-16T10:30:00Z'),
    arrivalTime: new Date('2026-05-16T12:45:00Z'),
    price: 3900,
    seatsAvailable: 110,
  },
  {
    flightNumber: 'VT909',
    airline: 'Vistara',
    source: 'KOLKATA',
    destination: 'BANGALORE',
    departureTime: new Date('2026-05-15T13:00:00Z'),
    arrivalTime: new Date('2026-05-15T15:45:00Z'),
    price: 6200,
    seatsAvailable: 40,
  },
  {
    flightNumber: 'SK110',
    airline: 'SkyReserve Airlines',
    source: 'PUNE',
    destination: 'NEW DELHI',
    departureTime: new Date('2026-05-15T05:30:00Z'),
    arrivalTime: new Date('2026-05-15T07:45:00Z'),
    price: 4000,
    seatsAvailable: 100,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing flights
    await Flight.deleteMany({});
    console.log('🗑️  Cleared existing flights');

    // Insert sample flights
    const inserted = await Flight.insertMany(sampleFlights);
    console.log(`✈️  Inserted ${inserted.length} sample flights`);

    console.log('\n📋 Seeded flights:');
    inserted.forEach((f) => {
      console.log(
        `   ${f.flightNumber} | ${f.airline} | ${f.source} → ${f.destination} | ₹${f.price} | ${f.seatsAvailable} seats`
      );
    });

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
