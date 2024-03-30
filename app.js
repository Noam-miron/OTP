const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: process.env.FRONT_DOMAIN
  }));

app.use('/auth', authRoutes);

module.exports = app;