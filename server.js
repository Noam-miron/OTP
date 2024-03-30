const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;

try {
  mongoose.connect(process.env.MONGOOSE_URL);
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.error('Error connecting to DB and starting server:', error);
}

module.exports = server;