const mongoose = require('mongoose');
const lodash = require('lodash');
//
const { slug } = require('../utils');
//
const subsSchema = new mongoose.Schema({
  houseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'House',
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
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
    enum: ['READY', 'RUNNING', 'DONE', "CANCELED"],
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