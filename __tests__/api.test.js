const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dotenv = require('dotenv').config();
const { app, server } = require('../server');
const mongoose = require('mongoose');

let mongod;
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGO_URL = mongod.getUri();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  await server.close();
});

jest.mock('../utils/otp', () => ({
  sendOTP: jest.fn().mockResolvedValue('OTP sent successfully'),
  generateOTP: jest.fn().mockResolvedValue('112233'),
}));

describe('POST /sendotp', () => {
  test('should return 200 OK and send OTP for registered user', async () => {
    const response = await request(app)
      .post('/auth/sendotp')
      .send({ email: process.env.MONGO_SEED_USER });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('OTP sent successfully');
  });

  test('should return 404 Not Found for unregistered user', async () => {
    const response = await request(app)
      .post('/auth/sendotp')
      .send({ email: 'unregistered_user@example.com' });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });
});
