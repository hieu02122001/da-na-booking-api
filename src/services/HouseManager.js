const lodash = require('lodash');
const { House } = require('../models/_House');
const { mongoose } = require('mongoose');
const { slug } = require('../utils');
const moment = require('moment');

this.findHouses = async function(criteria, more) {
  const queryObj = {
    isDeleted: false
  };
  // Build query
  // User Id
  const userId = lodash.get(criteria, "userId");
  if(mongoose.Types.ObjectId.isValid(userId)) {
    lodash.set(queryObj, "userId", mongoose.Types.ObjectId(userId));
  }
  // Search: slug
  let searchInfo = lodash.get(criteria, "search");
  if(searchInfo) {
    searchInfo = slug(searchInfo);
    lodash.set(queryObj, "$or", [
      { "slug": { "$regex": searchInfo } },
    ])
  }
  //
  const houses = await House.find(queryObj)
  .sort([['createdAt', -1]]);
  //
  for (let i = 0; i < houses.length; i++) {
    houses[i] = await this.wrapExtraToHouse(houses[i].toJSON(), more);
  }
  // pagination
  const DEFAULT_LIMIT = 6;
  const page = lodash.get(criteria, "page") || 1;
  const _start = DEFAULT_LIMIT * (page -1);
  const _end = DEFAULT_LIMIT * page;
  const paginatedHouses = lodash.slice(houses, _start, _end);
  //
  const output = {
    count: houses.length,
    page: page,
    rows: paginatedHouses,
  }
  return output;
}

this.getHouse = async function (houseId, more) {
  const house = await House.findById(houseId);
  //
  if (!house) {
    throw new Error(`Not found house with id [${houseId}]!`);
  }
  //
  return this.wrapExtraToHouse(house.toJSON(), more);
};

this.wrapExtraToHouse = async function(houseObj, more) {
  // id
  houseObj.id = lodash.get(houseObj, "_id").toString();
  //
  return lodash.omit(houseObj, ["_id"]);
};

this.createHouse = async function (houseObj, more) {
  const house = new House(houseObj);
  await house.save();
  //
  return house;
}

this.updateHouse = async function (houseId, houseObj, more) {
  const house = await House.findByIdAndUpdate(houseId, houseObj, { new: true, runValidators: true });
  //
  if (!house) {
    throw new Error(`Not found house with id [${houseId}]!`);
  }
  //
  await house.save();
  //
  return house;
}

this.deleteHouse = async function(houseId, more) {
  const house = await House.findByIdAndUpdate(houseId, {
    isDeleted: true
  }, { new: true });
  //
  if (!house) {
    throw new Error(`Not found house with id [${houseId}]!`);
  }
  //
  return house;
};

this.removeHouse = async function(houseId, more) {
  const house = await House.findByIdAndRemove(houseId);
  //
  if (!house) {
    throw new Error(`Not found house with id [${houseId}]!`);
  }
  //
  return house;
};
//
module.exports = this