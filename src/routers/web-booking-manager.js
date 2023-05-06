const express = require('express');
const lodash = require('lodash');
const router = new express.Router();

const BookingManager = require('../services/BookingManager');
//
const { PATH } = require('../utils');
//
router.get(PATH + '/bookings', async (req, res) => {
  const { query } = req;
  try {
    const result = await BookingManager.findBookings(query);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await BookingManager.getBooking(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + '/bookings', async (req, res) => {
  const { body } = req;
  try {
    const result = await BookingManager.createBooking(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/bookings/:id', async (req, res) => {
  const { body, params } = req;
  //
  try {
    const result = await BookingManager.updateBooking(params.id, body);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});

//
module.exports = router;