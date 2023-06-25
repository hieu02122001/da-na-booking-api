const express = require('express');
const lodash = require('lodash');
const router = new express.Router();

const BookingManager = require('../services/BookingManager');
//
const { PATH } = require('../utils');
const { House } = require('../models/_House');
const { auth } = require('../middleware/auth');
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
// LANDLORD ------------------------------------------------------------------------------------------------------------------

router.get(PATH + '/landlord/bookings', auth, async (req, res) => {
  const { query } = req;
  try {
    if (query.landlordId) {
      const houses = await House.find({ userId: query.landlordId });
      const houseIds = houses.map(item => item.id);
      query.houseIds = houseIds;
    }
    const result = await BookingManager.findBookings(query);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/landlord/bookings/:id', auth, async (req, res) => {
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
router.post(PATH + '/landlord/bookings', auth, async (req, res) => {
  const { body } = req;
  try {
    if (body.months) {
      body.checkOutDate = moment(body.checkInDate).add(body.months, "months")
    }
    const result = await BookingManager.createBooking(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/landlord/bookings/:id', auth, async (req, res) => {
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

router.put(PATH + '/landlord/bookings/:id/status/:status', auth, async (req, res) => {
  const { params } = req;
  //
  try {
    const result = await BookingManager.switchStatusBooking(params.id, params.status.toUpperCase());
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});

// TENANT -------------------------------------------------------------------------------------------------------------------

router.get(PATH + '/tenant/bookings', auth, async (req, res) => {
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
router.get(PATH + '/tenant/bookings/:id', auth, async (req, res) => {
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
router.post(PATH + '/tenant/bookings', auth, async (req, res) => {
  const { body } = req;
  try {
    if (body.months) {
      body.checkOutDate = moment(body.checkInDate).add(body.months, "months")
    }
    const result = await BookingManager.createBooking(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/tenant/bookings/:id', auth, async (req, res) => {
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

router.put(PATH + '/tenant/bookings/:id/status/:status', auth, async (req, res) => {
  const { params } = req;
  //
  try {
    const result = await BookingManager.switchStatusBooking(params.id, params.status.toUpperCase());
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;