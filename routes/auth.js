const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTP , generateOTP} = require('../utils/otp');

router.post('/sendotp', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = await generateOTP();
    
    // Save OTP and its expiration time in the database
    const userOTP = await OTP.findOneAndUpdate(
      { email },
      { otp, otpExpiration: Date.now() + 300000 }, // OTP expires in 5 minutes
      { upsert: true, new: true }
    );

    await sendOTP(email, otp);

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// This would be a good place to add an OTP verifying route

module.exports = router;