const request = require('supertest');
const dotenv = require('dotenv').config();
const app = require('../app');
const { setupMongoMemoryServer, teardownMongoMemoryServer } = require('./testSetup');

let mongod;

beforeAll(async () => {
  mongod = await setupMongoMemoryServer();
});

afterAll(async () => {
  await teardownMongoMemoryServer(mongod);
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
