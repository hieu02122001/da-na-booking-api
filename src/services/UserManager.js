const lodash = require("lodash");
const { User } = require("../models/_User");
const { House } = require("../models/_House");
const jwt = require("jsonwebtoken");
const { mongoose } = require("mongoose");
const { slug, formatDate } = require("../utils");

this.findUsers = async function (criteria, more) {
  const queryObj = {
    isDeleted: false,
  };
  // Build query
  // Role
  const userType = lodash.get(criteria, "userType");
  if (userType) {
    lodash.set(queryObj, "userType", userType);
  }
  // House Id
  const houseId = lodash.get(criteria, "houseId");
  if (mongoose.Types.ObjectId.isValid(houseId)) {
    lodash.set(queryObj, "houseId", mongoose.Types.ObjectId(houseId));
  }
  // Room Id
  const roomId = lodash.get(criteria, "roomId");
  if (mongoose.Types.ObjectId.isValid(roomId)) {
    lodash.set(queryObj, "roomId", mongoose.Types.ObjectId(roomId));
  }
  // Search: slug/phone/email
  let searchInfo = lodash.get(criteria, "search");
  if (searchInfo) {
    searchInfo = slug(searchInfo);
    lodash.set(queryObj, "$or", [
      { slug: { $regex: searchInfo } },
      { phone: { $regex: searchInfo } },
      { email: { $regex: searchInfo } },
    ]);
  }
  // Sort
  let sort = lodash.get(criteria, "sort");
  let order = lodash.get(criteria, "order");
  let setSort;
  if (sort && order) {
    const setOrder = (order === "ASC") ? 1 : -1;
    setSort = [[sort, setOrder]];
  }
  //
  const users = await User.find(queryObj).sort(setSort || [["createdAt", -1]]);
  //
  for (let i = 0; i < users.length; i++) {
    users[i] = await this.wrapExtraToUser(users[i].toJSON(), more);
  }
  // pagination
  if (more && more.notPaging === true) {
    return {
      count: users.length,
      rows: users
    }
  }
  //
  const DEFAULT_LIMIT = 6;
  const page = lodash.get(criteria, "page") || 1;
  const _start = DEFAULT_LIMIT * (page - 1);
  const _end = DEFAULT_LIMIT * page;
  const paginatedUsers = lodash.slice(users, _start, _end);
  //
  const output = {
    count: users.length,
    page: page,
    rows: paginatedUsers,
  };
  return output;
};

this.getUser = async function (userId, more) {
  const user = await User.findById(userId);
  //
  if (!user) {
    throw new Error(`Not found user with id [${userId}]!`);
  }
  //
  return this.wrapExtraToUser(user.toJSON(), more);
};

this.wrapExtraToUser = async function (userObj, more) {
  // id
  userObj.id = lodash.get(userObj, "_id").toString();
  // Date
  userObj.createdAt = formatDate(userObj.createdAt);
  userObj.updatedAt = formatDate(userObj.updatedAt);
  //
  if (more && more.withHouses === true) {
    const houses = await House.find({
      userId: userObj.id,
      isDeleted: false,
    }).sort([["createdAt", -1]]);
    userObj.houses = houses;
  }
  //
  return lodash.omit(userObj, ["_id", "password", "token"]);
};

this.createUser = async function (userObj, more) {
  const user = new User(userObj);
  await user.save();
  //
  return user;
};

this.updateUser = async function (userId, userObj, more) {
  const passwordChange = lodash.get(userObj, "password");
  lodash.unset(userObj, "password");
  const user = await User.findByIdAndUpdate(userId, userObj, {
    new: true,
    runValidators: true,
  });
  //
  if (!user) {
    throw new Error(`Not found user with id [${userId}]!`);
  }
  if (passwordChange) {
    user.password = passwordChange;
    await user.save();
  }
  //
  await user.save();
  //
  return user;
};

this.deleteUser = async function (userId, more) {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      isDeleted: true,
    },
    { new: true }
  );
  //
  if (!user) {
    throw new Error(`Not found user with id [${userId}]!`);
  }
  //
  return user;
};

this.removeUser = async function (userId, more) {
  const user = await User.findByIdAndRemove(userId);
  //
  if (!user) {
    throw new Error(`Not found user with id [${userId}]!`);
  }
  //
  return user;
};
//
this.generateAuthToken = async function (userId, more) {
  const user = await this.getUser(userId);
  const AUTH_KEY = "dana-booking";
  //
  const token = jwt.sign(
    {
      ...user,
    },
    AUTH_KEY
  );
  //
  return token;
};
//
module.exports = this;
