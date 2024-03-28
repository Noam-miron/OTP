const sendGrid = require("@sendgrid/mail");
const axios = require('axios');
const dotenv = require('dotenv').config();
const random = require('random-world');

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = process.env.WEATHER_API_URL;

async function sendOTP(email, otp) {
    const messageData = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: "OTP",
        text: `Your OTP is: ${otp}`,
    };
    try {
        await sendGrid.send(messageData);
        console.log("message sent");
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}

async function generateOTP() {
    const selected_cities = [];
    while (selected_cities.length < 3) { // 3 cities for the OTP, no duplicates
        const city=random.city();
        if (!selected_cities.includes(city)) {
            selected_cities.push(city);
        }
    }
    
    const temperatures = await Promise.all(selected_cities.map(city => getTemperature(city)));
    const otp = createOTP(temperatures);

    return otp;
}

async function getTemperature(city) {
    try {
      const response = await axios.get(`${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${city}`);
      return response.data.current.temp_c;
    } catch (error) {
      console.error('Error fetching temperature for city', city, ':', error);
      return null;
    }
  }
  
  function createOTP(temperatures) {
    // Extract the positive, integer part of each temperature and pad it to 2 digits
    const otpDigits = temperatures.map(temp => String(Math.abs(Math.trunc(temp))).padStart(2, '0'));
    return otpDigits.join('')
  }
  
module.exports = { sendOTP , generateOTP};