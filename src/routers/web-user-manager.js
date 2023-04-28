const express = require('express');
const lodash = require('lodash');
const router = new express.Router();

const UserManager = require('../services/UserManager');
//
const { PATH } = require('../utils');
//
router.get(PATH + '/users', async (req, res) => {
  try {
    const result = await UserManager.findUsers();
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;