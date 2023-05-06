const express = require('express');
const lodash = require('lodash');
const router = new express.Router();

const PackageManager = require('../services/PackageManager');
//
const { PATH } = require('../utils');
//
router.get(PATH + '/packages', async (req, res) => {
  const { query } = req;
  try {
    const result = await PackageManager.findPackages(query);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/packages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await PackageManager.getPackage(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + '/packages', async (req, res) => {
  const { body } = req;
  try {
    const result = await PackageManager.createPackage(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/packages/:id', async (req, res) => {
  const { body, params } = req;
  //
  try {
    const result = await PackageManager.updatePackage(params.id, body);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.delete(PATH + '/packages/:id', async (req, res) => {
  const { id } = req.params;
  //
  try {
    const result = await PackageManager.removePackage(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});

//
module.exports = router;