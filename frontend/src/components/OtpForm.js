import React, { useState } from 'react';
import axios from 'axios';

const OtpForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/sendotp', { email });
      alert('OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
      const message = error.response?.data?.error ?? '';
      alert(`Failed to send OTP \n ${message}`);
    }
  };

  return (
    <div>
      <h2>Enter your email to receive OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send OTP</button>
      </form>
    </div>
  );
};

export default OtpForm;
