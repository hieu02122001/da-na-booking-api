const lodash = require("lodash");
const { House } = require("../models/_House");
const { User } = require("../models/_User");
const { District } = require("../models/_District");
const { mongoose } = require("mongoose");
const { slug, formatDate } = require("../utils");
const { Room } = require("../models/_Room");

this.findHouses = async function (criteria, more) {
  const queryObj = {
    isDeleted: false,
  };
  // Build query
  // User Id
  const userId = lodash.get(criteria, "userId");
  if (mongoose.Types.ObjectId.isValid(userId)) {
    lodash.set(queryObj, "userId", new mongoose.Types.ObjectId(userId));
  }
  // district
  const district = lodash.get(criteria, "district");
  if (mongoose.Types.ObjectId.isValid(district)) {
    lodash.set(queryObj, "district", new mongoose.Types.ObjectId(district));
  }
  // isActivated
  const isActivated = lodash.get(criteria, "isActivated");
  if (lodash.isBoolean(isActivated)) {
    lodash.set(queryObj, "isActivated", isActivated);
  }
  // Search: slug
  let searchInfo = lodash.get(criteria, "search");
  if (searchInfo) {
    searchInfo = slug(searchInfo);
    lodash.set(queryObj, "$or", [{ slug: { $regex: searchInfo } }]);
  }
  //
  // Sort
  let sort = lodash.get(criteria, "sort");
  let order = lodash.get(criteria, "order");
  let setSort;
  if (sort && order) {
    const setOrder = (order === "ASC") ? 1 : -1;
    setSort = [[sort, setOrder]];
  }
  //
  const houses = await House.find(queryObj).sort(setSort || [["createdAt", -1]]);
  //
  for (let i = 0; i < houses.length; i++) {
    houses[i] = await this.wrapExtraToHouse(houses[i].toJSON(), more);
  }
  // pagination
  if (more && more.notPaging === true) {
    return {
      count: houses.length,
      rows: houses
    }
  }
  // pagination
  const DEFAULT_LIMIT = 6;
  const page = lodash.get(criteria, "page") || 1;
  const _start = DEFAULT_LIMIT * (page - 1);
  const _end = DEFAULT_LIMIT * page;
  const paginatedHouses = lodash.slice(houses, _start, _end);
  //
  const output = {
    count: houses.length,
    page: page,
    rows: paginatedHouses,
  };
  return output;
};

this.getHouse = async function (houseId, more) {
  const house = await House.findById(houseId);
  //
  if (!house) {
    throw new Error(`Not found house with id [${houseId}]!`);
  }
  //
  return this.wrapExtraToHouse(house.toJSON(), more);
};

this.wrapExtraToHouse = async function (houseObj, more) {
  // id
  houseObj.id = lodash.get(houseObj, "_id").toString();
  // Date
  houseObj.createdAt = formatDate(houseObj.createdAt);
  houseObj.updatedAt = formatDate(houseObj.updatedAt);
  // user
  const user = await User.findById(houseObj.userId);
  houseObj.owner = lodash.pick(user, ["fullName", "email"]);
  // district
  const district = await District.findById(houseObj.district);
  houseObj.district = lodash.pick(district, "name");
  // Due-date
  
  // Room count
  const roomCount = await Room.count({
    houseId: houseObj.id
  });
  houseObj.roomCount = roomCount;
  // Rented room count
  const rentedRoomCount = await Room.count({
    houseId: houseObj.id,
    userId: { $exists: true, $ne: null }
  });
  houseObj.rentedRoomCount = rentedRoomCount;
  // Room price
  const rooms = await Room.find({ houseId: houseObj.id });
  const prices = rooms.map(item => item.price) || [];
  houseObj.priceMin = Math.min(...prices).toLocaleString('vi-VI');
  houseObj.priceMax = Math.max(...prices).toLocaleString('vi-VI');
  //
  return lodash.omit(houseObj, ["_id"]);
};

this.createHouse = async function (houseObj, more) {
  const house = new House(houseObj);
  await house.save();
  //
  return house;
};

this.updateHouse = async function (houseId, houseObj, more) {
  const house = await House.findByIdAndUpdate(houseId, houseObj, {
    new: true,
    runValidators: true,
  });
  //
  if (!house) {
    throw new Error(`Not found house with id [${houseId}]!`);
  }
  //
  await house.save();
  //
  return house;
};

this.deleteHouse = async function (houseId, more) {
  const house = await House.findByIdAndUpdate(
    houseId,
    {
      isDeleted: true,
    },
    { new: true }
  );
  //
  if (!house) {
    throw new Error(`Not found house with id [${houseId}]!`);
  }
  //
  return house;
};

this.removeHouse = async function (houseId, more) {
  const house = await House.findByIdAndRemove(houseId);
  //
  if (!house) {
    throw new Error(`Not found house with id [${houseId}]!`);
  }
  //
  return house;
};
//
module.exports = this;
