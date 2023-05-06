const mongoose = require('mongoose');
const lodash = require('lodash');
//
const { slug } = require('../utils');
//
const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
  },
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
});
// # Methods

// # Middle-wares
//
roomSchema.pre('save', async function (next) {
  const room = this;
  //
  room.slug = slug(room.name);
  //
  next();
});
//
const Room = mongoose.model('Room', roomSchema);

module.exports = {
  Room
}