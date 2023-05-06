const express = require('express');
const lodash = require('lodash');
const router = new express.Router();

const RoomManager = require('../services/RoomManager');
//
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

//
module.exports = router;