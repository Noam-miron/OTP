const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  email: String,
  otp: String,
  otpExpiration: Date,
});

module.exports = mongoose.model('OTP', OTPSchema);