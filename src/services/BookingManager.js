const lodash = require('lodash');
const { Booking } = require('../models/_Booking');
const { mongoose } = require('mongoose');
const { slug } = require('../utils');
const moment = require('moment');

this.findBookings = async function(criteria, more) {
  // Build query
  //
  const bookings = await Booking.find()
  .sort([['price', 1]]);
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
  //
  return lodash.omit(bookingObj, ["_id"]);
};

this.createBooking = async function (bookingObj, more) {
  // Convert Date
  const { checkInDate, checkOutDate, ...convertedObj } = bookingObj;
  convertedObj.checkInDate = new Date(bookingObj.checkInDate);
  convertedObj.checkOutDate = new Date (bookingObj.checkOutDate);
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

//
module.exports = this