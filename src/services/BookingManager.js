const lodash = require('lodash');
const { Booking } = require('../models/_Booking');
const { mongoose } = require('mongoose');
const { slug, formatDate } = require('../utils');
const moment = require('moment');
const { House } = require('../models/_House');
const { Room } = require('../models/_Room');
const { User } = require('../models/_User');

this.findBookings = async function(criteria, more) {
  // Build query
  const queryObj = {};
  // UserId
  const userId = lodash.get(criteria, "userId");
  if (mongoose.Types.ObjectId.isValid(userId)) {
    lodash.set(queryObj, "userId", new mongoose.Types.ObjectId(userId));
  }
  // House Ids
  const houseIds = lodash.get(criteria, "houseIds");
  if(lodash.isArray(houseIds)) {
    lodash.set(queryObj, "houseId", { $in: houseIds });
  }
  //
  const bookings = await Booking.find()
  .sort([['updatedAt', -1]]);
  //
  for (let i = 0; i < bookings.length; i++) {
    bookings[i] = await this.wrapExtraToBooking(bookings[i].toJSON(), more);
  }
  // pagination
  const DEFAULT_LIMIT = 6;
  const page = lodash.get(criteria, "page") || 1;
  const _start = DEFAULT_LIMIT * (page -1);
  const _end = DEFAULT_LIMIT * page;
  const paginatedBookings = lodash.slice(bookings, _start, _end);
  //
  const output = {
    count: bookings.length,
    page: page,
    rows: paginatedBookings,
  }
  return output;
}

this.getBooking = async function (bookingId, more) {
  const bookings = await Booking.findById(bookingId);
  //
  if (!bookings) {
    throw new Error(`Not found bookings with id [${bookingId}]!`);
  }
  //
  return this.wrapExtraToBooking(bookings.toJSON(), more);
};

this.wrapExtraToBooking = async function(bookingObj, more) {
  // id
  bookingObj.id = lodash.get(bookingObj, "_id").toString();
  // Date
  bookingObj.createdAt = formatDate(bookingObj.createdAt);
  bookingObj.updatedAt = formatDate(bookingObj.updatedAt);
  if (bookingObj.checkInDate) {
    bookingObj.checkInDate = formatDate(bookingObj.checkInDate);
  }
  if (bookingObj.checkOutDate)
    bookingObj.checkOutDate = formatDate(bookingObj.checkOutDate);
  // House
  const house = await House.findById(bookingObj.houseId);
  bookingObj.house = lodash.pick(house, ["name"]);
  // Room
  const room = await Room.findById(bookingObj.roomId);
  bookingObj.room = lodash.pick(room, ["name"]);
  // User
  const user = await User.findById(bookingObj.userId);
  bookingObj.user = lodash.pick(user, ["fullName", "email"]);
  //
  bookingObj.totalPrice = bookingObj.totalPrice.toLocaleString("vi-VI");
  //
  return lodash.omit(bookingObj, ["_id"]);
};

this.createBooking = async function (bookingObj, more) {
  // Convert Date
  const { checkInDate, checkOutDate, ...convertedObj } = bookingObj;
  convertedObj.checkInDate = new Date(bookingObj.checkInDate);
  convertedObj.checkOutDate = new Date (bookingObj.checkOutDate);
  //
  if (lodash.isString(bookingObj.totalPrice)) {
    convertedObj.totalPrice = Number(bookingObj.totalPrice.replaceAll(".", ""));
  }
  //
  const booking = new Booking(convertedObj);
  await booking.save();
  //
  return booking;
}

this.updateBooking = async function (bookingId, bookingObj, more) {
  // Convert Date
  const convertedObj = { ...bookingObj };
  if ("checkInDate" in bookingObj) {
    convertedObj.checkInDate = new Date(bookingObj.checkInDate);
  }
  if ("checkOutDate" in bookingObj) {
    convertedObj.checkOutDate = new Date(bookingObj.checkOutDate);
  }
  //
  const booking = await Booking.findByIdAndUpdate(bookingId, convertedObj, { new: true, runValidators: true });
  if (!booking) {
    throw new Error(`Not found booking with id [${bookingId}]!`);
  }
  //
  await booking.save();
  //
  return booking;
}

this.switchStatusBooking = async function (bookingId, status, more) {
  const bookingObj = { status };
  //
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error(`Not found booking with id [${bookingId}]!`);
  }
  //
  const updatedBooking = await Booking.findByIdAndUpdate(
    bookingId,
    bookingObj,
    { new: true, runValidators: true }
  );
  //
  if (status === "SUCCESS") {}
  //
  return updatedBooking;
};
//
module.exports = this