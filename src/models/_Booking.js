const mongoose = require('mongoose');
const lodash = require('lodash');
//
const { slug } = require('../utils');
//
const bookingSchema = new mongoose.Schema({
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', "APPROVED", 'SUCCESS', 'REJECTED'],
    default: "PENDING"
  }
}, {
  timestamps: true,
});
// # Methods

// # Middle-wares

//
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = {
  Booking
}