const mongoose = require('mongoose');

const CONNECTION_URL = 'mongodb://172.17.0.1:27017/dana-booking';
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
});