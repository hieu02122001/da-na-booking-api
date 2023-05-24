const express = require('express');
const lodash = require('lodash');
const router = new express.Router();

const UserManager = require('../services/UserManager');
//
const { auth } = require('../middleware/auth');
const { PATH } = require('../utils');
const { User } = require('../models/_User');
//
router.get(PATH + '/users', async (req, res) => {
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
router.get(PATH + '/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserManager.getUser(id);
    //
    res.send(user);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.get(PATH + '/me', auth, async (req, res) => {
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
router.post(PATH + '/users', async (req, res) => {
  const { body } = req;
  try {
    const result = await UserManager.createUser(body)
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.put(PATH + '/users/:id', async (req, res) => {
  const { body, params } = req;
  //
  try {
    const user = await UserManager.updateUser(params.id, body);
    //
    res.send(user);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
//
router.delete(PATH + '/users/:id', async (req, res) => {
  const { id } = req.params;
  //
  try {
    const user = await UserManager.deleteUser(id);
    //
    res.send(user);
  } catch(error) {
    res.status(400).send({ message: error.message });
  }
});
// ADMIN
router.post(PATH + '/users/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password, { userType: "ADMIN" });
    //
    const token = await UserManager.generateAuthToken(user._id);
    user.token = token;
    await user.save();
    //
    const userObj = user.toJSON();
    userObj.id = userObj._id;
    lodash.unset(userObj, '_id');
    //
    res.send({ user: userObj, token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get(PATH + '/admin/users', async (req, res) => {
  const { query } = req;
  try {
    const result = await UserManager.findUsers(query);
    //
    res.send(result);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
// LANDLORD
router.post(PATH + '/users/landlord/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password, { userType: "LANDLORD" });
    //
    const token = await UserManager.generateAuthToken(user._id);
    user.token = token;
    await user.save();
    //
    const userObj = user.toJSON();
    userObj.id = userObj._id;
    lodash.unset(userObj, '_id');
    //
    res.send({ user: userObj, token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
// CLIENT
router.post(PATH + '/users/client/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password, { userType: "CLIENT" });
    //
    const token = await UserManager.generateAuthToken(user._id);
    user.token = token;
    await user.save();
    //
    const userObj = user.toJSON();
    userObj.id = userObj._id;
    lodash.unset(userObj, '_id');
    //
    res.send({ user: userObj, token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
//
module.exports = router;