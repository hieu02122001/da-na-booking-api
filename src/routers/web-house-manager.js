const express = require('express');
const lodash = require('lodash');
const router = new express.Router();

const HouseManager = require('../services/HouseManager');
//
const { auth } = require("../middleware/auth");
const { PATH } = require('../utils');
//
router.get(PATH + '/houses', async (req, res) => {
  const { query } = req;
  try {
    const result = await HouseManager.findHouses(query);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/houses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await HouseManager.getHouse(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + '/houses', async (req, res) => {
  const { body } = req;
  try {
    const result = await HouseManager.createHouse(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/houses/:id', async (req, res) => {
  const { body, params } = req;
  //
  try {
    const result = await HouseManager.updateHouse(params.id, body);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.delete(PATH + '/houses/:id', async (req, res) => {
  const { id } = req.params;
  //
  try {
    const result = await HouseManager.deleteHouse(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
// Filter -------------------------------------------------------------------------------------------------------------------
router.get(PATH + "/filter/houses", async (req, res) => {
  const { query } = req;
  try {
    lodash.set(query, "sort", "name");
    lodash.set(query, "order", "ASC");
    //
    const more = { notPaging: true };
    //
    const result = await HouseManager.findHouses(query, more);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
// ADMIN -------------------------------------------------------------------------------------------------------------------
router.get(PATH + '/admin/houses', auth, async (req, res) => {
  const { query } = req;
  try {
    const result = await HouseManager.findHouses(query);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/admin/houses/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await HouseManager.getHouse(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + '/admin/houses', auth, async (req, res) => {
  const { body } = req;
  try {
    const result = await HouseManager.createHouse(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/admin/houses/:id', auth, async (req, res) => {
  const { body, params } = req;
  //
  try {
    const result = await HouseManager.updateHouse(params.id, body);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.delete(PATH + '/admin/houses/:id', auth, async (req, res) => {
  const { id } = req.params;
  //
  try {
    const result = await HouseManager.deleteHouse(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
// LANDLORD -------------------------------------------------------------------------------------------------------------------
router.get(PATH + '/landlord/houses', auth, async (req, res) => {
  const { query } = req;
  const landlordId = req.user._id;
  query.userId = landlordId;
  try {
    const result = await HouseManager.findHouses(query, { notPaging: true });
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/landlord/houses/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await HouseManager.getHouse(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + '/landlord/houses', auth, async (req, res) => {
  const { body } = req;
  try {
    const result = await HouseManager.createHouse(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/landlord/houses/:id', auth, async (req, res) => {
  const { body, params } = req;
  //
  try {
    const result = await HouseManager.updateHouse(params.id, body);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
// TENANT -------------------------------------------------------------------------------------------------------------------
router.get(PATH + '/tenant/houses', async (req, res) => {
  const { query } = req;
  query.isActivated = true;
  try {
    const result = await HouseManager.findHouses(query, { notPaging: true, withPrice: true });
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/tenant/houses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await HouseManager.getHouse(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;