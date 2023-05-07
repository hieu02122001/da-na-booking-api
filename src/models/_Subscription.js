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
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'READY', 'PAYING', 'RUNNING', 'DONE', "CANCELED"],
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