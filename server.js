const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();
let server;
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());

app.use(cors({
    origin: process.env.FRONT_DOMAIN
  }));

app.use('/auth', authRoutes);

try {
  mongoose.connect(process.env.MONGOOSE_URL);
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error('Error connecting to DB and starting server:', error);
}

module.exports = { app, server };