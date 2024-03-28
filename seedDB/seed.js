const User = require('../models/User');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const userData = [
  { email: process.env.MONGO_SEED_USER },
];

async function seedDatabase() {
  try {
    mongoose.connect(process.env.MONGOOSE_URL);
    await User.deleteMany();
    await User.create(userData);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
   mongoose.disconnect();
  }
}

seedDatabase();
