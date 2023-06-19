const express = require("express");
const lodash = require("lodash");
const router = new express.Router();

const UserManager = require("../services/UserManager");
//
const { auth } = require("../middleware/auth");
const { PATH } = require("../utils");
const { User } = require("../models/_User");
const { House } = require("../models/_House");
const { Room } = require("../models/_Room");
//
router.get(PATH + "/users", async (req, res) => {
  const { query } = req;
  try {
    const result = await UserManager.findUsers(query);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + "/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserManager.getUser(id);
    //
    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + "/me", auth, async (req, res) => {
  const id = req.user._id;
  try {
    const result = await UserManager.getUser(id);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + "/users", async (req, res) => {
  const { body } = req;
  try {
    const result = await UserManager.createUser(body);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + "/users/:id", async (req, res) => {
  const { body, params } = req;
  //
  try {
    const user = await UserManager.updateUser(params.id, body);
    //
    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.delete(PATH + "/users/:id", async (req, res) => {
  const { id } = req.params;
  //
  try {
    const user = await UserManager.deleteUser(id);
    //
    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
// Filter -------------------------------------------------------------------------------------------------------------------
router.get(PATH + "/filter/landlords", async (req, res) => {
  const { query } = req;
  try {
    lodash.set(query, "userType", "LANDLORD");
    lodash.set(query, "sort", "email");
    lodash.set(query, "order", "ASC");
    //
    const more = { notPaging: true };
    //
    const result = await UserManager.findUsers(query, more);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
// ADMIN -------------------------------------------------------------------------------------------------------------------
router.post(PATH + "/admin/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password, {
      userType: "ADMIN",
    });
    //
    const token = await UserManager.generateAuthToken(user._id);
    user.token = token;
    await user.save();
    //
    const userObj = user.toJSON();
    userObj.id = userObj._id;
    lodash.unset(userObj, "_id");
    //
    res.send({ user: userObj, token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + "/admin/users", auth, async (req, res) => {
  const { query } = req;
  try {
    lodash.set(query, "userType", "LANDLORD");
    //
    const more = { withHouses: true };
    const result = await UserManager.findUsers(query, more);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + "/admin/users/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const more = { withHouses: true };
    const user = await UserManager.getUser(id, more);
    //
    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + "/admin/users", auth, async (req, res) => {
  const { body } = req;
  try {
    lodash.set(body, "userType", "LANDLORD");
    const result = await UserManager.createUser(body);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
router.put(PATH + "/admin/users/:id", auth, async (req, res) => {
  const { body, params } = req;
  //
  try {
    const user = await UserManager.updateUser(params.id, body);
    //
    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.delete(PATH + "/admin/users/:id", auth, async (req, res) => {
  const { id } = req.params;
  //
  try {
    const user = await UserManager.deleteUser(id);
    //
    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
// LANDLORD -------------------------------------------------------------------------------------------------------------------
router.post(PATH + "/users/landlord/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password, {
      userType: "LANDLORD",
    });
    //
    const token = await UserManager.generateAuthToken(user._id);
    user.token = token;
    await user.save();
    //
    const userObj = user.toJSON();
    userObj.id = userObj._id;
    lodash.unset(userObj, "_id");
    //
    res.send({ user: userObj, token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + "/landlord/users", auth, async (req, res) => {
  const { query } = req;
  try {
    // Get list tenant id
    const landlordId = req.user._id;
    const houses = await House.find({
      userId: landlordId
    });
    //
    const tenantIds = [];
    //
    if (houses.length > 0) {
      const houseIds = [];
      for (const item of houses) {
        houseIds.push(item._id);
      }
      //
      const rooms = await Room.find({
        houseId: {
          $in: houseIds
        }
      })
      //
      for (const item of rooms) {
        if (item.userId) {
          tenantIds.push(item.userId);
        }
      }
    }
    //
    query.ids = tenantIds;
    //
    const more = { withRoom: true };
    const result = await UserManager.findUsers(query, more);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + "/landlord/users/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const more = { withRoom: true };
    const user = await UserManager.getUser(id, more);
    //
    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.post(PATH + "/landlord/users", auth, async (req, res) => {
  const { body } = req;
  try {
    lodash.set(body, "userType", "LANDLORD");
    const result = await UserManager.createUser(body);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
router.put(PATH + "/landlord/users/:id", auth, async (req, res) => {
  const { body, params } = req;
  //
  try {
    const user = await UserManager.updateUser(params.id, body);
    //
    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.delete(PATH + "/landlord/users/:id", auth, async (req, res) => {
  const { id } = req.params;
  //
  try {
    const user = await UserManager.deleteUser(id);
    //
    res.send(user);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
// CLIENT -------------------------------------------------------------------------------------------------------------------
router.post(PATH + "/users/client/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password, {
      userType: "TENANT",
    });
    //
    const token = await UserManager.generateAuthToken(user._id);
    user.token = token;
    await user.save();
    //
    const userObj = user.toJSON();
    userObj.id = userObj._id;
    lodash.unset(userObj, "_id");
    //
    res.send({ user: userObj, token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;
