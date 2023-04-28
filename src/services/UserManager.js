const lodash = require('lodash');
const { User } = require('../models/_User');
const jwt = require('jsonwebtoken');
const { mongoose } = require('mongoose');
const { slug } = require('../utils');
const moment = require('moment');

this.findUsers = async function(criteria, more) {
  return { msg: "Hello" };
}

module.exports = this