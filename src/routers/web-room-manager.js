const express = require('express');
const lodash = require('lodash');
const router = new express.Router();

const RoomManager = require('../services/RoomManager');
const { House } = require('../models/_House');
//
const { auth } = require("../middleware/auth");
const { PATH } = require('../utils');
//
router.get(PATH + '/rooms', async (req, res) => {
  const { query } = req;
  try {
    const result = await RoomManager.findRooms(query);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/rooms/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await RoomManager.getRoom(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + '/rooms', async (req, res) => {
  const { body } = req;
  try {
    const result = await RoomManager.createRoom(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/rooms/:id', async (req, res) => {
  const { body, params } = req;
  //
  try {
    const result = await RoomManager.updateRoom(params.id, body);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.delete(PATH + '/rooms/:id', async (req, res) => {
  const { id } = req.params;
  //
  try {
    const result = await RoomManager.deleteRoom(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});

// LANDLORD -------------------------------------------------------------------------------------------------------------------

router.get(PATH + '/landlord/rooms', auth, async (req, res) => {
  const { query } = req;
  if (query.isAds) {
    query.isAds = query.isAds === 'false' ? false : true;
  }
  try {
    const result = await RoomManager.findRooms(query, { notPaging: true });
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/landlord/rooms/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await RoomManager.getRoom(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + '/landlord/rooms', auth, async (req, res) => {
  const { body } = req;
  try {
    const result = await RoomManager.createRoom(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/landlord/rooms/:id', auth, async (req, res) => {
  const { body, params } = req;
  //
  try {
    const result = await RoomManager.updateRoom(params.id, body);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.delete(PATH + '/landlord/rooms/:id', auth, async (req, res) => {
  const { id } = req.params;
  //
  try {
    const result = await RoomManager.deleteRoom(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});

// TENANT -------------------------------------------------------------------------------------------------------------------

router.get(PATH + '/tenant/rooms', async (req, res) => {
  const { query } = req;
  query.isAds = true;
  if (query.district) {
    const houses = await House.find({ district: query.district});
    const houseIds = houses.map(item => item._id);
    query.houseIds = houseIds;
  }
  try {
    const result = await RoomManager.findRooms(query, { notPaging: true });
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/tenant/rooms/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await RoomManager.getRoom(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;