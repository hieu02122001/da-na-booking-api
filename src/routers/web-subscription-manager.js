const express = require('express');
const lodash = require('lodash');
const router = new express.Router();

const SubscriptionManager = require('../services/SubscriptionManager');
//
const { auth } = require("../middleware/auth");
const { PATH } = require('../utils');
//
router.get(PATH + '/subscriptions', async (req, res) => {
  const { query } = req;
  try {
    const result = await SubscriptionManager.findSubscriptions(query);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/subscriptions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await SubscriptionManager.getSubscription(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + '/subscriptions', async (req, res) => {
  const { body } = req;
  try {
    const result = await SubscriptionManager.createSubscription(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/subscriptions/:id', async (req, res) => {
  const { body, params } = req;
  //
  try {
    const result = await SubscriptionManager.updateSubscription(params.id, body);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
// ADMIN -------------------------------------------------------------------------------------------------------------------
router.get(PATH + '/admin/subscriptions', auth, async (req, res) => {
  const { query } = req;
  try {
    const result = await SubscriptionManager.findSubscriptions(query);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/admin/subscriptions/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await SubscriptionManager.getSubscription(id);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + '/admin/subscriptions', auth, async (req, res) => {
  const { body } = req;
  try {
    const result = await SubscriptionManager.createSubscription(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/admin/subscriptions/:id', auth, async (req, res) => {
  const { body, params } = req;
  //
  try {
    const result = await SubscriptionManager.updateSubscription(params.id, body);
    //
    res.send(result);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});

// LANDLORD ----------------------------------------------------------------------------------------------------------------

//
module.exports = router;