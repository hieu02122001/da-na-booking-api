const express = require("express");
const lodash = require("lodash");
const router = new express.Router();
//
const GeneralManager = require("../services/GeneralManager");
//
const { PATH } = require("../utils");
//
router.get(PATH + "/filter/districts", async (req, res) => {
  try {
    const result = await GeneralManager.findDistricts();
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;
