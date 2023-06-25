const lodash = require("lodash");
const { Subscription } = require("../models/_Subscription");
const { House } = require("../models/_House");
const { Room } = require("../models/_Room");
const { User } = require("../models/_User");
const { Package } = require("../models/_Package");
const { mongoose } = require("mongoose");
const { formatDate } = require("../utils");
const moment = require("moment");

this.findSubscriptions = async function (criteria, more) {
  const queryObj = {};
  // Build query
  const userId = lodash.get(criteria, "userId");
  if (mongoose.Types.ObjectId.isValid(userId)) {
    lodash.set(queryObj, "userId", new mongoose.Types.ObjectId(userId));
  }
  //
  const roomId = lodash.get(criteria, "roomId");
  if (mongoose.Types.ObjectId.isValid(roomId)) {
    lodash.set(queryObj, "roomId", new mongoose.Types.ObjectId(roomId));
  }
  //
  const status = lodash.get(criteria, "status");
  if (lodash.isString(status)) {
    lodash.set(queryObj, "status", status);
  }
  //
  const subscriptions = await Subscription.find(queryObj).sort([
    ["updatedAt", -1],
  ]);
  //
  for (let i = 0; i < subscriptions.length; i++) {
    subscriptions[i] = await this.wrapExtraToSubscription(
      subscriptions[i].toJSON(),
      more
    );
  }
  // pagination
  if (more && more.notPaging === true) {
    return {
      count: subscriptions.length,
      rows: subscriptions
    }
  }
  // pagination
  const DEFAULT_LIMIT = 6;
  const page = lodash.get(criteria, "page") || 1;
  const _start = DEFAULT_LIMIT * (page - 1);
  const _end = DEFAULT_LIMIT * page;
  const paginatedSubscriptions = lodash.slice(subscriptions, _start, _end);
  //
  const output = {
    count: subscriptions.length,
    page: page,
    rows: paginatedSubscriptions,
  };
  return output;
};

this.getSubscription = async function (subscriptionId, more) {
  const subscriptions = await Subscription.findById(subscriptionId);
  //
  if (!subscriptions) {
    throw new Error(`Not found subscriptions with id [${subscriptionId}]!`);
  }
  //
  return this.wrapExtraToSubscription(subscriptions.toJSON(), more);
};

this.wrapExtraToSubscription = async function (subscriptionObj, more) {
  const house = await House.findById(subscriptionObj.houseId);
  subscriptionObj.house = lodash.pick(house, ["name"]);
  //
  const room = await Room.findById(subscriptionObj.roomId);
  subscriptionObj.room = lodash.pick(room, ["name"]);
  //
  const user = await User.findById(subscriptionObj.userId);
  subscriptionObj.user = lodash.pick(user, ["fullName", "email"]);
  // id
  subscriptionObj.id = lodash.get(subscriptionObj, "_id").toString();
  // Date
  subscriptionObj.createdAt = formatDate(subscriptionObj.createdAt);
  subscriptionObj.updatedAt = formatDate(subscriptionObj.updatedAt);
  if (subscriptionObj.beginDate) {
    subscriptionObj.beginDate = formatDate(subscriptionObj.beginDate);
  }
  if (subscriptionObj.endDate)
    subscriptionObj.endDate = formatDate(subscriptionObj.endDate);

  // total price
  subscriptionObj.totalPrice =
    subscriptionObj.totalPrice.toLocaleString("vi-VI");
  if (lodash.isNumber(subscriptionObj.brokerageFee))
    subscriptionObj.brokerageFee =
      subscriptionObj.brokerageFee.toLocaleString("vi-VI");
  //
  return lodash.omit(subscriptionObj, ["_id"]);
};

this.createSubscription = async function (subscriptionObj, more) {
  subscriptionObj.beginDate = new Date();
  if (lodash.isString(subscriptionObj.totalPrice)) {
    subscriptionObj.totalPrice = Number(subscriptionObj.totalPrice.replaceAll(".", ""));
  }
  //
  const subscription = new Subscription(subscriptionObj);
  await subscription.save();
  //
  await Room.findByIdAndUpdate(subscriptionObj.roomId, { isAds: true });
  //
  return subscription;
};

this.updateSubscription = async function (
  subscriptionId,
  subscriptionObj,
  more
) {
  // Convert Date
  const convertedObj = { ...subscriptionObj };
  if ("beginDate" in subscriptionObj) {
    convertedObj.beginDate = new Date(subscriptionObj.beginDate);
  }
  if ("endDate" in subscriptionObj) {
    convertedObj.endDate = new Date(subscriptionObj.endDate);
  }
  //
  const subscription = await Subscription.findByIdAndUpdate(
    subscriptionId,
    convertedObj,
    { new: true, runValidators: true }
  );
  if (!subscription) {
    throw new Error(`Not found subscription with id [${subscriptionId}]!`);
  }
  //
  await subscription.save();
  //
  return subscription;
};

this.switchStatusSubscription = async function (subscriptionId, status, more) {
  const subsObj = { status };
  //
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new Error(`Not found subscription with id [${subscriptionId}]!`);
  }
  // Add endDate when status is SUCCESS
  if (status === "SUCCESS") {
    subsObj.endDate = new Date();
    subsObj.brokerageFee = subscription.totalPrice * 0.05;
  } else if (status === "FAIL") {
    subsObj.endDate = new Date();
    subsObj.brokerageFee = 0;
  }
  //
  const updatedSubscription = await Subscription.findByIdAndUpdate(
    subscriptionId,
    subsObj,
    { new: true, runValidators: true }
  );
  //
  return updatedSubscription;
};

//
module.exports = this;
