const mongoose = require('mongoose');
const lodash = require('lodash');
//
const { slug } = require('../utils');
//
const subsSchema = new mongoose.Schema({
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
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  beginDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['READY', 'RUNNING', 'SUCCESS', 'FAIL'],
    default: "READY"
  }
}, {
  timestamps: true,
});
// # Methods

// # Middle-wares

//
const Subscription = mongoose.model('Subscription', subsSchema);

module.exports = {
  Subscription
}