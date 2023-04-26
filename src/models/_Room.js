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

//
roomSchema.methods.toJSON = function () {
  const OMIT_FIELDS = [];
  //
  const room = this;
  const roomObj = lodash.omit(room, OMIT_FIELDS);
  //
  return roomObj;
}
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