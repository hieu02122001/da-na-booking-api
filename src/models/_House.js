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
  },
  description: {
    type: String,
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

//
houseSchema.methods.toJSON = function () {
  const OMIT_FIELDS = [];
  //
  const house = this;
  const houseObj = lodash.omit(house, OMIT_FIELDS);
  //
  return houseObj;
}
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