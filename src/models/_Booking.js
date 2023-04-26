const mongoose = require('mongoose');
const lodash = require('lodash');
//
const { slug } = require('../utils');
//
const bookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
  },
}, {
  timestamps: true,
});
// # Methods

//
bookingSchema.methods.toJSON = function () {
  const OMIT_FIELDS = [];
  //
  const booking = this;
  const bookingObj = lodash.omit(booking, OMIT_FIELDS);
  //
  return bookingObj;
}
// # Middle-wares

//
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = {
  Booking
}