const mongoose = require('mongoose');
const lodash = require('lodash');
//
const { slug } = require('../utils');
//
const houseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District',
  },
  address: {
    type: String,
    required: true,
  },
  isActivated: {
    type: Boolean,
    required: true,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  rooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  }]
}, {
  timestamps: true,
});
// # Methods

// # Middle-wares
//
houseSchema.pre('save', async function (next) {
  const house = this;
  //
  house.slug = slug(house.name);
  //
  next();
});
//
const House = mongoose.model('House', houseSchema);

module.exports = {
  House
}