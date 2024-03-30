const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const User = require('../models/User');

let mongod;

async function setupMongoMemoryServer() {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongod.getUri();

  await mongoose.connect(process.env.MONGO_URL)

  // Seed MongoMemoryServer instance
  await User.create({ email: process.env.MONGO_SEED_USER });

  return mongod;
}

async function teardownMongoMemoryServer() {
  if (mongod) {
    await mongod.stop();
  }
}

module.exports = { setupMongoMemoryServer, teardownMongoMemoryServer };