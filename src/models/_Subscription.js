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
  }
}, {
  timestamps: true,
});
// # Methods

//
subsSchema.methods.toJSON = function () {
  const OMIT_FIELDS = [];
  //
  const subs = this;
  const subsObj = lodash.omit(subs, OMIT_FIELDS);
  //
  return subsObj;
}
// # Middle-wares

//
const Subscription = mongoose.model('Subscription', subsSchema);

module.exports = {
  Subscription
}