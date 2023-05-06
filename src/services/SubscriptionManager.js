const lodash = require('lodash');
const { Subscription } = require('../models/_Subscription');
const { mongoose } = require('mongoose');
const { slug } = require('../utils');
const moment = require('moment');

this.findSubscriptions = async function(criteria, more) {
  // Build query
  //
  const subscriptions = await Subscription.find()
  .sort([['price', 1]]);
  //
  for (let i = 0; i < subscriptions.length; i++) {
    subscriptions[i] = await this.wrapExtraToSubscription(subscriptions[i].toJSON(), more);
  }
  // pagination
  const DEFAULT_LIMIT = 6;
  const page = lodash.get(criteria, "page") || 1;
  const _start = DEFAULT_LIMIT * (page -1);
  const _end = DEFAULT_LIMIT * page;
  const paginatedSubscriptions = lodash.slice(subscriptions, _start, _end);
  //
  const output = {
    count: subscriptions.length,
    page: page,
    rows: paginatedSubscriptions,
  }
  return output;
}

this.getSubscription = async function (subscriptionId, more) {
  const subscriptions = await Subscription.findById(subscriptionId);
  //
  if (!subscriptions) {
    throw new Error(`Not found subscriptions with id [${subscriptionId}]!`);
  }
  //
  return this.wrapExtraToSubscription(subscriptions.toJSON(), more);
};

this.wrapExtraToSubscription = async function(subscriptionObj, more) {
  // id
  subscriptionObj.id = lodash.get(subscriptionObj, "_id").toString();
  //
  return lodash.omit(subscriptionObj, ["_id"]);
};

this.createSubscription = async function (subscriptionObj, more) {
  // Convert Date
  const { beginDate, endDate, ...convertedObj } = subscriptionObj;
  convertedObj.beginDate = new Date(subscriptionObj.beginDate);
  convertedObj.endDate = new Date (subscriptionObj.endDate);
  //
  const subscription = new Subscription(convertedObj);
  await subscription.save();
  //
  return subscription;
}

this.updateSubscription = async function (subscriptionId, subscriptionObj, more) {
  // Convert Date
  const convertedObj = { ...subscriptionObj };
  if ("beginDate" in subscriptionObj) {
    convertedObj.beginDate = new Date(subscriptionObj.beginDate);
  }
  if ("endDate" in subscriptionObj) {
    convertedObj.endDate = new Date(subscriptionObj.endDate);
  }
  //
  const subscription = await Subscription.findByIdAndUpdate(subscriptionId, convertedObj, { new: true, runValidators: true });
  if (!subscription) {
    throw new Error(`Not found subscription with id [${subscriptionId}]!`);
  }
  //
  await subscription.save();
  //
  return subscription;
}

//
module.exports = this