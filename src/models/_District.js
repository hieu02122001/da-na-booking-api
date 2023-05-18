const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
}, {
  timestamps: false
})

const District = mongoose.model('District', districtSchema);

module.exports = {
  District
}