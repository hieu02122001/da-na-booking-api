const mongoose = require('mongoose');
const lodash = require('lodash');
//
const { slug } = require('../utils');
//
const bookingSchema = new mongoose.Schema({
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
  },
  status: {
    type: String,
    enum: ['READY', 'RUNNING', 'DONE', "CANCELED"],
    default: "READY"
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