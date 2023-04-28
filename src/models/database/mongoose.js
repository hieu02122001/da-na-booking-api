const mongoose = require('mongoose');

const CONNECTION_URL = 'mongodb://0.0.0.0:27017/dana-booking';
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
});