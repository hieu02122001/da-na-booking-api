const lodash = require('lodash');
const { Subscription } = require('../models/_Subscription');
const { House } = require("../models/_House");
const { User } = require("../models/_User");
const { Package } = require("../models/_Package");
const { mongoose } = require('mongoose');
const { formatDate } = require('../utils');
const moment = require('moment');

this.findSubscriptions = async function(criteria, more) {
  const queryObj = {};
  // Build query
  const userId = lodash.get(criteria, "userId");
  if (mongoose.Types.ObjectId.isValid(userId)) {
    lodash.set(queryObj, "userId", new mongoose.Types.ObjectId(userId));
  }
  //
  const houseId = lodash.get(criteria, "houseId");
  if (mongoose.Types.ObjectId.isValid(houseId)) {
    lodash.set(queryObj, "houseId", new mongoose.Types.ObjectId(houseId));
  }
  //
  const packageId = lodash.get(criteria, "packageId");
  if (mongoose.Types.ObjectId.isValid(packageId)) {
    lodash.set(queryObj, "packageId", new mongoose.Types.ObjectId(packageId));
  }
  //
  const status = lodash.get(criteria, "status");
  if (lodash.isString(status)) {
    lodash.set(queryObj, "status", status);
  }
  //
  const subscriptions = await Subscription.find(queryObj)
  .sort([['updatedAt', -1]]);
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
  //
  const house = await House.findById(subscriptionObj.houseId);
  subscriptionObj.house = lodash.pick(house, ["name"]);
  //
  const user = await User.findById(subscriptionObj.userId);
  subscriptionObj.user = lodash.pick(user, ["fullName", "email"]);
  //
  const package = await Package.findById(subscriptionObj.packageId);
  subscriptionObj.package = lodash.pick(package, ["name"]);
  // id
  subscriptionObj.id = lodash.get(subscriptionObj, "_id").toString();
  // Date
  subscriptionObj.createdAt = formatDate(subscriptionObj.createdAt);
  subscriptionObj.updatedAt = formatDate(subscriptionObj.updatedAt);
  if (subscriptionObj.beginDate && subscriptionObj.endDate) {
    subscriptionObj.beginDate = formatDate(subscriptionObj.beginDate);
    subscriptionObj.endDate = formatDate(subscriptionObj.endDate);
  }
  // total price
  subscriptionObj.totalPrice = subscriptionObj.totalPrice.toLocaleString('vi-VI');
  //
  return lodash.omit(subscriptionObj, ["_id"]);
};

this.createSubscription = async function (subscriptionObj, more) {
  //
  const subscription = new Subscription(subscriptionObj);
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

this.switchStatusSubscription = async function (subscriptionId, status, more) {
  const subsObj = { status }
  //
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new Error(`Not found subscription with id [${subscriptionId}]!`);
  }
  // Add beginDate & endDate when status is RUNNING
  if (status === "RUNNING") {
    const { months } = await Package.findById(subscription.packageId);
    //
    const latestRunningSubs = await Subscription.findOne({
      houseId: new mongoose.Types.ObjectId(subscription.houseId),
      status: "RUNNING"
    }).sort([["endDate", -1]]);
    if (!latestRunningSubs) {
      const beginDate = new Date();
      const endDate = moment(beginDate).add(months, "months");
      subsObj.beginDate = beginDate;
      subsObj.endDate = endDate;
    } else {
      const beginDate = latestRunningSubs.endDate;
      const endDate = moment(beginDate).add(months, "months");
      subsObj.beginDate = beginDate;
      subsObj.endDate = endDate;
    }
  }
  //
  const updatedSubscription = await Subscription.findByIdAndUpdate(subscriptionId, subsObj, { new: true, runValidators: true });
  //
  const anyRunningSubs = await Subscription.findOne({
    houseId: new mongoose.Types.ObjectId(subscription.houseId),
    status: "RUNNING"
  })
  if (!anyRunningSubs) {
    await House.findByIdAndUpdate(subscription.houseId, { isActivated: false });
  } else {
    await House.findByIdAndUpdate(subscription.houseId, { isActivated: true });
  }
  //
  return updatedSubscription;
}

//
module.exports = this